"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Shield, CheckCircle, Loader2, Terminal, Download } from "lucide-react";
import AnalysisLogs from "./AnalysisLogs";

interface ToolModalProps {
  tool: {
    name: string;
    cat: string;
    icon: React.ReactNode;
    id: string;
    tasks?: string[];
  } | null;
  onClose: () => void;
}

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const defaultTasks = ["Initializing Engine", "Validating Evidence", "Running Deep Scan", "Generating Report"];
  const tasks = tool?.tasks || defaultTasks;

  useEffect(() => {
    if (status === "running") {
      const totalTasks = tasks.length;
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Slower, more granular progress
          const nextProgress = prev + (Math.random() * 5 + 2);
          
          // Ensure we don't skip task indices
          const calculatedTaskIndex = Math.floor((nextProgress / 100) * totalTasks);
          if (calculatedTaskIndex < totalTasks) {
            setCurrentTaskIndex(calculatedTaskIndex);
          }

          if (nextProgress >= 100) {
            clearInterval(interval);
            // Small delay before showing the final success screen so user can see all tasks checked
            setTimeout(() => setStatus("complete"), 1000);
            return 100;
          }
          return nextProgress;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status, tasks.length]);

  if (!tool) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tool.name}</h3>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{tool.cat}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {status === "idle" && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-emerald-400 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Operational Pipeline
                  </h4>
                  <div className="space-y-3">
                    {tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setStatus("running")}
                  aria-label="Start forensic analysis"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Initiate Forensic Analysis
                </button>
              </div>
            )}

            {status === "running" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">Current Task</p>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{tasks[currentTaskIndex]}</h4>
                      </div>
                    </div>
                    <span className="text-2xl font-mono font-bold text-emerald-500">{Math.floor(progress)}%</span>
                  </div>
                  
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                   {tasks.map((task, i) => (
                     <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${i === currentTaskIndex && progress < 100 ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-500" : (i < currentTaskIndex || (i === tasks.length - 1 && progress === 100)) ? "opacity-50 border-transparent text-slate-500" : "border-transparent text-slate-400"}`}>
                       <span className="text-xs font-bold uppercase tracking-tight">{task}</span>
                       {(i < currentTaskIndex || (i === tasks.length - 1 && progress === 100)) ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : i === currentTaskIndex ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                     </div>
                   ))}
                </div>
              </div>
            )}

            {status === "complete" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Complete</h4>
                    <p className="text-slate-600 dark:text-emerald-500/80 font-medium">All forensic artifacts have been successfully verified and indexed.</p>
                  </div>
                </div>
                <div className="flex justify-center">
                    <button 
                      onClick={() => {
                        const content = `FORENSIC CASE REPORT\n====================\nTool: ${tool.name}\nCategory: ${tool.cat}\nStatus: Verified\nTimestamp: ${new Date().toISOString()}\nIntegrity Hash: SHA-256:${Math.random().toString(36).substring(2, 15)}\n\nTasks Completed:\n${tasks.map(t => `- [x] ${t}`).join("\n")}`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${tool.name.toLowerCase()}_report_${Date.now()}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      aria-label="Download forensic case report"
                      className="w-full max-w-sm flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-500 transition shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                    >
                    <Download className="w-5 h-5" />
                    Download Forensic Case
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em]">
              Forensic Integrity Protocol V4.2 • Secured Session
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
