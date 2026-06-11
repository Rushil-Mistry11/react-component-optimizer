# React Component Optimizer AI Agent

An intelligent AI-powered tool designed to refine and optimize React components. This project uses an agentic loop consisting of an **Optimizer** and an **Evaluator** to ensure that components adhere to strict architectural and styling guidelines.

## Features

- **Agentic Optimization Loop**: Unlike a single-pass LLM call, this tool iteratively optimizes and evaluates code until it meets a set of strict criteria or reaches the maximum iteration limit.
- **Universal Rule Enforcement**: Ensures every component follows these core principles:
  - **Single File Architecture**: Component and styles are contained within one file.
  - **Constrained Layouts**: Automatic application of max-width boundaries and centering.
  - **Standardized Iconography**: Enforces the use of `lucide-react` for all icons.
  - **Tailwind CSS First**: Strictly uses Tailwind CSS for all styling, banning inline styles or separate CSS files.
- **Custom Rule Support**: Users can provide additional custom instructions to tailor the optimization to specific needs.
- **Modern UI**: A sleek, dark-themed workspace built with React and Tailwind CSS.

## Tech Stack

### Backend
- **Node.js** & **Express**: Powering the API and orchestration logic.
- **OpenAI SDK**: Used to interface with LLMs (configured for Ollama compatibility).
- **dotenv**: For environment variable management.

### Frontend
- **React** (Vite): For a fast, reactive user interface.
- **Tailwind CSS**: For a modern, responsive design.
- **Lucide React**: For consistent and beautiful iconography.
- **Axios**: For seamless communication with the backend.

## Architecture

The core of the project is the **Review Loop** implemented in the backend:

1. **Optimizer Stage**: The LLM receives the raw code and rules, then generates an optimized version.
2. **Evaluator Stage**: A second LLM call (with temperature 0 for consistency) evaluates the optimized code against the Universal Rules.
3. **Feedback Loop**: If the Evaluator finds issues, the feedback is fed back into the Optimizer for another iteration.
4. **Completion**: The process repeats until the code is valid or 3 iterations are completed.

## Setup & Installation

### Prerequisites
- Node.js (Latest LTS recommended)
- An LLM provider (e.g., Ollama running locally or an OpenAI-compatible API)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   OLLAMA_BASE_URL=http://localhost:11434/v1
   OLLAMA_API_KEY=your_api_key_here
   MODEL=your-model-name (e.g., llama3, mistral)
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Start both the backend and frontend servers.
2. Open the frontend application in your browser.
3. Paste your "messy" React component code into the **Draft Component** area.
4. (Optional) Add any specific requirements in the **Custom Rules** section.
5. Click **Optimize Component**.
6. Watch the agent loop execute and receive the pristine, optimized source code.

