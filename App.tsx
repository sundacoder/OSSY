import React, { useState, useRef, useEffect } from 'react';
import { StrategySelector } from './components/StrategySelector';
import { TokenList } from './components/TokenList';
import { AnalyticsChart } from './components/AnalyticsChart';
import { StrategyType, FilteredTokenDetails, ChatMessage } from './types';
import { STRATEGIES } from './constants';
import { runAgent } from './services/geminiService';
import { Brain, Sparkles, Terminal, Cpu } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
        logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleStrategySelect = async (strategyId: StrategyType) => {
    if (isProcessing) return;
    
    setSelectedStrategy(strategyId);
    setIsProcessing(true);
    setLogs([]); // Clear logs for new run
    setMessages([]); // Clear previous chat context for this demo

    const strategy = STRATEGIES.find(s => s.id === strategyId);
    if (!strategy) return;

    // UI Feedback
    addLog(`System initiated. Selected Protocol: ${strategyId.toUpperCase()}`);
    addLog(`Loading OpenServ SDK modules...`);
    
    const userPrompt = `I want to execute the ${strategy.title} strategy. ${strategy.promptContext}. Use the filterTokens tool to find the best assets right now.`;
    
    setMessages(prev => [...prev, { role: 'user', content: `Strategy Selected: ${strategy.title}` }]);

    try {
      // Simulate "Agent" Thinking delay
      await new Promise(r => setTimeout(r, 800));
      
      const result = await runAgent(userPrompt, addLog);

      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: result.text, 
          tokens: result.tokens 
        }
      ]);
      
      addLog("Process completed successfully.");

    } catch (error) {
      console.error(error);
      addLog("CRITICAL ERROR: Agent failed to execute.");
      setMessages(prev => [...prev, { role: 'model', content: "I encountered a critical error while connecting to the DexScreener agent." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-purple-500/30">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-600/20 p-2 rounded-lg border border-purple-500/30">
                        <Cpu className="text-purple-400" size={20} />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        OSSY <span className="font-mono font-normal text-xs text-zinc-500 ml-1">v1.0.4 // AGENT_INTERFACE</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                     <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>System Online</span>
                     </div>
                     <span className="hidden sm:inline">|</span>
                     <span className="hidden sm:inline">OpenServ SDK Active</span>
                </div>
            </div>
        </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6">
                <Brain size={14} className="text-purple-400" />
                <span>AI-Powered DexScreener Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Select your <span className="text-purple-400">Alpha Strategy</span>
            </h2>
            <p className="text-zinc-400 text-lg">
                OSSY autonomously scans DexScreener using advanced filtering logic to identify tokens matching your risk profile.
            </p>
        </div>

        {/* Strategy Selection */}
        <StrategySelector 
            selected={selectedStrategy} 
            onSelect={handleStrategySelect}
            disabled={isProcessing}
        />

        {/* Output Section */}
        {(messages.length > 0 || isProcessing) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                
                {/* Left Column: Logs & Chat */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Terminal Logs */}
                    <div className="rounded-xl border border-zinc-800 bg-black/80 p-4 font-mono text-xs h-48 overflow-y-auto shadow-inner relative">
                        <div className="absolute top-2 right-2 opacity-50">
                            <Terminal size={14} className="text-zinc-600" />
                        </div>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="text-green-500/80 break-words">{log}</div>
                            ))}
                             {isProcessing && (
                                <div className="text-green-500/80 animate-pulse">_</div>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </div>

                    {/* Agent Response Card */}
                    {messages.map((msg, idx) => (
                        msg.role === 'model' && (
                            <div key={idx} className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-6 relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="text-purple-400" size={18} />
                                    <h3 className="font-semibold text-purple-100">Agent Analysis</h3>
                                </div>
                                <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">{line}</p>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Right Column: Data Visualization */}
                <div className="lg:col-span-2">
                    {messages.map((msg, idx) => (
                        msg.tokens && (
                            <div key={idx} className="space-y-8 animate-in zoom-in-95 duration-500">
                                <AnalyticsChart tokens={msg.tokens} />
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Identified Assets</h3>
                                    <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400">
                                        {msg.tokens.length} Matches Found
                                    </span>
                                </div>
                                <TokenList tokens={msg.tokens} />
                            </div>
                        )
                    ))}
                    {isProcessing && (
                        <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                            <p className="text-zinc-500 font-mono text-sm animate-pulse">Scanning blockchain data...</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;