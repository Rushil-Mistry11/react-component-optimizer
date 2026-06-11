require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    baseURL: process.env.OLLAMA_BASE_URL,
    apiKey: process.env.OLLAMA_API_KEY,
});

const UNIVERSAL_RULES = `
The component must adhere to the following strict rules:
1. Single File Rule: The entire component and its styles must be contained in a single file.
2. Constrained Layout: The main content must be wrapped in a container with a max-width boundary (e.g., max-w-7xl or max-w-4xl) and centered.
3. Iconography: Use lucide-react for all icons. Ensure they are imported correctly.
4. Styling: Use Tailwind CSS exclusively. Do not use inline styles or separate CSS files.
`;

const MAX_ITERATIONS = 3;

async function callLLM(prompt, temperature) {
    const response = await openai.chat.completions.create({
        model: process.env.MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
    });
    return response.choices[0].message.content;
}

function stripMarkdown(text) {
    return text.replace(/```(?:jsx|tsx|javascript|typescript|html)?\n?([\s\S]*?)\n?```/g, '$1').trim();
}

app.post('/api/review', async (req, res) => {
    const { code, customRules } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    let currentCode = '';
    let feedback = '';
    let iteration = 0;
    let isValid = false;

    try {
        while (iteration < MAX_ITERATIONS && !isValid) {
            iteration++;

            // --- Optimizer Stage ---
            const optimizerPrompt = iteration === 1
                ? `Optimize the following React component. Follow the Universal Rules and these custom instructions: ${customRules || 'None'}. \n\nUniversal Rules:\n${UNIVERSAL_RULES}\n\nCode:\n${code}\n\nOutput ONLY the raw code without markdown wrappers.`
                : `The previous version failed evaluation. Feedback: ${feedback}. Please fix the code while still adhering to all Universal Rules and custom instructions: ${customRules || 'None'}. \n\nUniversal Rules:\n${UNIVERSAL_RULES}\n\nCode:\n${currentCode}\n\nOutput ONLY the raw code without markdown wrappers.`;

            const optimizedResult = await callLLM(optimizerPrompt, 0.2);
            currentCode = stripMarkdown(optimizedResult);

            // --- Evaluator Stage ---
            const evaluatorPrompt = `Evaluate the following React code against these rules: ${UNIVERSAL_RULES}. Does it follow every rule? Output your response in JSON format: {"valid": boolean, "feedback": "string describing what is missing or wrong"}. \n\nCode:\n${currentCode}`;

            const evaluationResult = await callLLM(evaluatorPrompt, 0.0);

            try {
                const jsonMatch = evaluationResult.match(/\{.*\}/s);
                if (jsonMatch) {
                    const evalData = JSON.parse(jsonMatch[0]);
                    isValid = evalData.valid;
                    feedback = evalData.feedback;
                } else {
                    isValid = false;
                    feedback = "Evaluator failed to provide a valid JSON response. Please refine the code structure.";
                }
            } catch (e) {
                isValid = false;
                feedback = "Evaluator encountered a JSON parsing error. Please refine the code structure.";
            }
        }

        res.json({
            optimizedCode: currentCode,
            iterations: iteration,
            isValid: isValid
        });
    } catch (error) {
        console.error('Error during review loop:', error);
        res.status(500).json({ error: 'Internal server error during optimization loop' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
