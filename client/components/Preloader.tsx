"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Loader2, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 transition-colors duration-300"
        >
          <div className="absolute top-6 right-6 z-[10000]">
            <ThemeToggle />
          </div>
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Shield className="w-16 h-16 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -inset-5 border-2 border-emerald-500/10 border-t-emerald-500/40 rounded-full"
            />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase font-mono">
              Sentinel Forensics
            </h2>
            <div className="flex items-center justify-center gap-2 text-emerald-500/60 font-mono text-[10px] uppercase tracking-tighter">
              <Loader2 className="w-3 h-3 animate-spin" />
              Initializing Secure Environment... {progress}%
            </div>
          </div>

          <div className="mt-8 w-64 h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-linear-to-r from-emerald-600 to-emerald-400"
            />
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 opacity-60">
             <div className="flex flex-col items-center gap-2 group transition-all duration-500 hover:opacity-100">
                <Lock className="w-4 h-4 text-slate-700 dark:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-[8px] font-mono text-slate-200 uppercase tracking-widest">SSL_ENCRYPT</span>
             </div>
             <div className="flex flex-col items-center gap-2 group transition-all duration-500 hover:opacity-100">
                <Shield className="w-4 h-4 text-slate-700 dark:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-[8px] font-mono text-slate-200 uppercase tracking-widest">AES_256</span>
             </div>
             <div className="flex flex-col items-center gap-2 group transition-all duration-500 hover:opacity-100">
                <Loader2 className="w-4 h-4 text-slate-700 dark:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <span className="text-[8px] font-mono text-slate-200 uppercase tracking-widest">SHA_VAL</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
