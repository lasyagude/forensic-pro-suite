"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function TermsPage() {
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
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Terms of Conditions</h1>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Version: 1.0.4-LTS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-slate-400 hover:text-blue-500 dark:hover:text-white transition-colors text-sm font-mono uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Return_to_Station
              </Link>
            </div>
          </div>

          <section className="space-y-8 leading-relaxed text-slate-400">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest font-mono">1. Proper Use of Tools</h2>
              <p>
                Users of the Forensic Pro Suite agree to use these tools solely for authorized digital investigations. Any use for illegal surveillance, unauthorized data access, or malicious intent is strictly prohibited and will result in immediate session termination.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest font-mono">2. Evidence Integrity</h2>
              <p>
                While our tools are built for high accuracy, the final responsibility for evidence verification lies with the investigator. The platform provides automated guidance, but professional forensic standards must be maintained for legal admissibility.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest font-mono">3. Account Responsibility</h2>
              <p>
                Your investigator credentials are sensitive. Sharing accounts or bypassing security controls is a violation of these terms. All actions taken under your ID are recorded in the audit log.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest font-mono">4. Modifications</h2>
              <p>
                We reserve the right to update these terms to reflect changes in forensic standards or legal requirements. Continued use of the platform after updates constitutes acceptance of the modified terms.
              </p>
            </div>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
