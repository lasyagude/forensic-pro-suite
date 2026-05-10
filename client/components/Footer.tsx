"use client";
import Link from "next/link";
import { Shield, FileText, Scale, BookOpen, Github, Mail, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand & Repo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-tighter">
              <Shield className="w-6 h-6" />
              <span className="uppercase text-lg">Forensic Pro Suite</span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
              Professional-grade digital forensics workstation with integrated AI guidance and real-time artifact verification.
            </p>
            <a 
              href="https://github.com/Akshay473/forensic-pro-suite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors text-xs font-mono"
            >
              <Github className="w-4 h-4" />
              Akshay473/forensic-pro-suite
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Platform</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/privacy" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5" /> Privacy
                </Link>
                <Link href="/terms" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Terms
                </Link>
                <Link href="/docs" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Docs
                </Link>
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Connect</h4>
              <div className="flex flex-col gap-3">
                <a href="mailto:akshayshibu473@gmail.com" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <a href="https://linkedin.com/in/akshay-shibu-b3b904281" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a href="https://www.instagram.com/akshay_4_7_3?igsh=Y3N5ZHo4dGw4bHc5" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-colors text-[11px] font-mono uppercase tracking-widest flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Forensic Pro Suite • All Rights Reserved
          </p>
          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
            Version 1.0.4-LTS_STABLE
          </div>
        </div>
      </div>
    </footer>
  );
}
