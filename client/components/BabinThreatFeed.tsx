"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIMULATED_LOGS = [
  "INCOMING: Automated SHA-256 integrity check initiated...",
  "DEEP_SCAN: Magic numbers identified as 0x89 0x50 0x4E 0x47 (PNG Signature)",
  "INTEGRITY: Dual-hash MD5 verification completed. Match found.",
  "THREAT_INTEL: Cross-referencing findings with Babin's Global Database...",
  "STATUS: Threat level determined: NEUTRAL.",
  "REPORT: Chain-of-custody documentation generated.",
  "ALERT: New forensic artifact detected in volatility buffer.",
  "NETWORK: Connection attempt from unauthorized IP range 192.168.1.105 blocked.",
  "SYSTEM: Kernel integrity verified. No rootkits detected.",
  "BABIN_ENGINE: Heuristic analysis complete. No obfuscation found."
];

export default function BabinThreatFeed() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [SIMULATED_LOGS[Math.floor(Math.random() * SIMULATED_LOGS.length)], ...prev];
        return next.slice(0, 8);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-5 font-mono shadow-inner">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          Babin Live Threat Intel
        </h3>
        <span className="text-[8px] text-slate-500">SECURE_CHANNEL_v4.2</span>
      </div>
      <div className="space-y-2 min-h-[160px]">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.p
              key={`${log}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-[9px] text-slate-400 border-l border-slate-800 pl-3 leading-relaxed"
            >
              <span className="text-emerald-600 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
              {log}
            </motion.p>
          ))}
          {logs.length === 0 && (
            <p className="text-[9px] text-slate-600 italic">Establishing secure uplink...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
