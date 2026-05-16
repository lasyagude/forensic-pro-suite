"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Effective Date: May 10, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 dark:hover:text-white transition-colors text-sm font-mono uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return_to_Station
              </Link>
            </div>
          </div>

          <section className="space-y-8 leading-relaxed text-slate-400">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">1. Evidence Handling</h2>
              <p>
                The Forensic Pro Suite is designed with a &quot;Security-First&quot; architecture. Any data processed through the Automated Flow or individual forensic tools is handled locally within your session. We do not store evidence files on our centralized servers unless explicitly uploaded to a secure vault.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">2. AI Assistant Intelligence</h2>
              <p>
                Our AI Assistant (powered by Gemini/Groq) processes queries in a stateless manner. While your messages are sent to the AI providers to generate responses, they are not used to train global models. Your specific forensic findings remain private to your investigator account.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">3. Auditor Access</h2>
              <p>
                Chain-of-custody logs and generated PDF reports are accessible only to authorized investigators and designated system administrators. All access is logged with cryptographic timestamps to ensure non-repudiation.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">4. Infrastructure Security</h2>
              <p>
                We employ industry-standard encryption (AES-256) for data at rest and TLS 1.3 for all data in transit. Our servers are located in ISO 27001 certified data centers with 24/7 physical monitoring.
              </p>
            </div>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
