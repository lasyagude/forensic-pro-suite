"use client";
import Link from "next/link";
import { Shield, FileText, Scale, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-tighter">
            <Shield className="w-5 h-5" />
            <span className="uppercase text-sm">Forensic Pro Suite</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">
            © 2026 Digital Forensics Workstation. Secure Channel.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
          <Link 
            href="/privacy" 
            className="group flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-[11px] font-mono uppercase tracking-widest"
          >
            <Scale className="w-4 h-4 group-hover:animate-pulse" />
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="group flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-[11px] font-mono uppercase tracking-widest"
          >
            <FileText className="w-4 h-4 group-hover:animate-pulse" />
            Terms of Conditions
          </Link>
          <Link 
            href="/docs" 
            className="group flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-[11px] font-mono uppercase tracking-widest"
          >
            <BookOpen className="w-4 h-4 group-hover:animate-pulse" />
            Documentation
          </Link>
        </nav>

        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          Version 1.0.4-LTS_STABLE
        </div>
      </div>
    </footer>
  );
}
