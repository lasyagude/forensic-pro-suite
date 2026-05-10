"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Terminal, Cpu, Database, Search } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function DocsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Documentation</h1>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Operational Manual v1.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-slate-400 hover:text-purple-500 dark:hover:text-white transition-colors text-sm font-mono uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return_to_Station
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-400 font-bold tracking-tight">
                <Cpu className="w-5 h-5" />
                <span>Automated Flow</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The Automated Flow tool utilizes machine learning to scan evidence files for known malware signatures and suspicious anomalies. Simply drag and drop a file to begin the deep-dive analysis.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-blue-400 font-bold tracking-tight">
                <Terminal className="w-5 h-5" />
                <span>Investigator CLI</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                A powerful command-line interface integrated directly into the browser. Supports commands like <code className="text-blue-300">fls</code>, <code className="text-blue-300">vol.py</code>, and <code className="text-blue-300">wireshark --cli</code> for rapid data extraction.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-purple-400 font-bold tracking-tight">
                <Database className="w-5 h-5" />
                <span>Case Management</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Maintain a verifiable chain of custody. Every analysis result is automatically logged to the database with cryptographic hashes to ensure data integrity over time.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-400 font-bold tracking-tight">
                <Search className="w-5 h-5" />
                <span>AI Guidance</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Need help? Ask the AI Assistant. It can explain tool outputs, suggest next steps in an investigation, and provide documentation on complex forensic processes.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-emerald-500/20 p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Start Guide</h2>
            <ol className="list-decimal list-inside space-y-4 text-slate-400 text-sm">
              <li>Navigate to the <span className="text-slate-900 dark:text-white">Dashboard</span> and verify your investigator status.</li>
              <li>Select a tool from the primary grid or use the <span className="text-slate-900 dark:text-white">Automated Flow</span> for rapid ingestion.</li>
              <li>Monitor the <span className="text-slate-900 dark:text-white">Live Threat Intel</span> feed for real-time updates on your analysis.</li>
              <li>Export findings via <span className="text-slate-900 dark:text-white">PDF Report</span> or <span className="text-slate-900 dark:text-white">Evidence Bundle</span> for external documentation.</li>
            </ol>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
