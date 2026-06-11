import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Code2, Loader2, Terminal, Settings2, Atom } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/review';

function App() {
  const [inputCode, setInputCode] = useState('');
  const [customRules, setCustomRules] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!inputCode.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, {
        code: inputCode,
        customRules: customRules,
      });
      setOptimizedCode(response.data.optimizedCode);
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Failed to optimize component. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            React Component-Optimizer <span className="text-slate-400 font-normal">Ai agent</span>
          </h1>
        </div>

        <button
          onClick={handleOptimize}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-md font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
          {isLoading ? 'Optimizing...' : 'Optimize Component'}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Editor & Rules */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col h-full bg-slate-900/30">
          <div className="p-4 flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Settings2 className="w-3 h-3" />
                Custom Rules
              </div>
              <textarea
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                placeholder="// RULE: e.g. Use a grid layout for the gallery section..."
                className="w-full h-24 p-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-0"> 
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                Draft Component
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste your messy React component here..."
                className="w-full min-h-100 flex-1 p-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono resize-none overflow-y-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="w-1/2 bg-slate-950 flex flex-col h-150 relative">
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              Optimized Source
            </div>
            <div className="flex-1 relative group">
              <textarea
                readOnly
                value={optimizedCode}
                className="w-full h-full p-4 bg-slate-900/50 border border-emerald-500/30 rounded-md text-sm text-emerald-400 placeholder-slate-600 font-mono outline-none resize-none focus:border-emerald-500/50 transition-all"
                placeholder="Pristine code will appear here after optimization..."
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-md">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-sm text-slate-400 animate-pulse font-medium">Agent loop executing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
