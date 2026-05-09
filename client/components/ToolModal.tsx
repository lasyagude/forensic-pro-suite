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
  } | null;
  onClose: () => void;
}

export default function ToolModal({ tool, onClose }: ToolModalProps) {
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("complete");
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

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
                  <h4 className="text-sm font-bold text-slate-900 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Operational Readiness
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tool is ready for ingestion. Ensure evidence integrity before mounting the image or initiating the network capture. All actions are logged under NIST-compliant forensic standards.
                  </p>
                </div>
                <button 
                  onClick={() => setStatus("running")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Initiate Forensic Analysis
                </button>
              </div>
            )}

            {status === "running" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Processing...</span>
                  </div>
                  <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">{Math.floor(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <AnalysisLogs />
              </div>
            )}

            {status === "complete" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Analysis Finalized</h4>
                    <p className="text-sm text-slate-600 dark:text-emerald-500/80">Evidence hash verified. Integrity check passed.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg">
                    <Terminal className="w-5 h-5" />
                    View CLI Logs
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm">
                    <Download className="w-5 h-5" />
                    Export Case
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em]">
              Forensic Integrity Protocol V4.2
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
