"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, ExternalLink, HardDriveDownload, Cpu, Binary, FileSpreadsheet } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const tools = [
  {
    phase: "Evidence Collection & Preservation",
    icon: <HardDriveDownload className="w-5 h-5" />,
    color: "emerald",
    items: [
      { name: "FTK Imager", desc: "Industry standard for creating forensic images (bit-to-bit copies) without installing software", link: "https://www.exterro.com/ftk-imager" },
      { name: "Tableau Write-Blockers", desc: "Physical hardware bridges that prevent data from being written back to evidence drives", link: "#" },
      { name: "Cellebrite UFED", desc: "Primary tool for mobile device extraction, bypasses locks to pull data from smartphones", link: "https://cellebrite.com" },
      { name: "Guymager", desc: "Popular open-source forensic imager for Linux-based acquisitions", link: "https://guymager.sourceforge.io" },
      { name: "Faraday Bags", desc: "Shielded pouches that block wireless signals to prevent remote wiping", link: "#" }
    ]
  },
  {
    phase: "Volatile Data & Memory Forensics",
    icon: <Cpu className="w-5 h-5" />,
    color: "blue",
    items: [
      { name: "Volatility Framework", desc: "Powerful open-source tool for analyzing memory dumps to find processes, passwords, and network connections", link: "https://www.volatilityfoundation.org" },
      { name: "DumpIt", desc: "Simple utility to create a snapshot of Windows machine's physical memory", link: "#" },
      { name: "Magnet RAM Capture", desc: "Free tool for quick memory imaging", link: "https://www.magnetforensics.com/resources/magnet-ram-capture" }
    ]
  },
  {
    phase: "Deep Analysis & File Recovery",
    icon: <Binary className="w-5 h-5" />,
    color: "purple",
    items: [
      { name: "Autopsy / Sleuth Kit", desc: "Leading open-source digital forensics platform with GUI for web history, email, and keyword search", link: "https://www.sleuthkit.org/autopsy" },
      { name: "EnCase", desc: "High-end commercial suite for deep-dive analysis and case management", link: "https://www.opentext.com/products/encase-forensic" },
      { name: "Magnet AXIOM", desc: "Excellent for artifact-based recovery - chat logs, social media, cloud data", link: "https://www.magnetforensics.com/products/magnet-axiom" },
      { name: "Wireshark", desc: "Network forensics tool to analyze packet captures and trace malicious traffic", link: "https://www.wireshark.org" },
      { name: "PhotoRec / TestDisk", desc: "Specialized in carving files out of unallocated space or recovering lost partitions", link: "https://www.cgsecurity.org/wiki/PhotoRec" }
    ]
  },
  {
    phase: "Reporting & Courtroom Presentation",
    icon: <FileSpreadsheet className="w-5 h-5" />,
    color: "amber",
    items: [
      { name: "Casenotes", desc: "Open-source tool for detailed, timestamped logs of every investigation action", link: "#" },
      { name: "Evidence Center (Belkasoft)", desc: "Provides Evidence Maps and automated reports easy for non-technical people", link: "https://belkasoft.com/evidence-center" },
      { name: "Veracrypt", desc: "Secure storage for case files and findings before court finalization", link: "https://www.veracrypt.fr" }
    ]
  }
];

const colorMap: Record<string, { text: string; border: string; bg: string; hover: string }> = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", hover: "hover:border-emerald-500/50" },
  blue: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", hover: "hover:border-blue-500/50" },
  purple: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", hover: "hover:border-purple-500/50" },
  amber: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", hover: "hover:border-amber-500/50" },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Forensic Tools Reference</h1>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Complete Toolkit v1.0</p>
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

          {tools.map((phase, idx) => {
            const colors = colorMap[phase.color];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-5"
              >
                <div className={`flex items-center gap-3 border-b ${colors.border} pb-3`}>
                  <div className={`${colors.text}`}>{phase.icon}</div>
                  <h2 className={`font-mono text-sm tracking-wide ${colors.text} font-bold uppercase`}>
                    {phase.phase}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.items.map((tool, toolIdx) => (
                    <div
                      key={toolIdx}
                      className={`border border-slate-200 dark:border-slate-800 ${colors.hover} transition-all p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 shadow-sm hover:shadow-md group`}
                    >
                      <h3 className="text-slate-900 dark:text-white font-bold text-base mb-2">{tool.name}</h3>
                      <p className="text-slate-500 text-sm mb-3 leading-relaxed">{tool.desc}</p>
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2 ${colors.text} hover:opacity-80 transition-opacity`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Access Tool
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
