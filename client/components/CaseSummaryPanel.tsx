"use client";

import { CaseSummary } from "@/lib/types";

export default function CaseSummaryPanel({ caseData }: { caseData: CaseSummary }) {
  const getThreatColor = (score: number) => {
    if (score < 35) return "bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    if (score < 70) return "bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
    return "bg-red-500 dark:bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
        Case Summary Reference
      </h2>

      <div className="mt-4 space-y-3 text-sm font-mono">
        <p className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-800/30 pb-2">
          <span className="text-slate-400">Case ID:</span> 
          <span className="font-bold text-slate-900 dark:text-white">{caseData.caseId}</span>
        </p>
        <p className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-800/30 pb-2">
          <span className="text-slate-400">File:</span> 
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]" title={caseData.filename}>{caseData.filename}</span>
        </p>
        <p className="flex flex-col gap-1 text-xs border-b border-slate-50 dark:border-slate-800/30 pb-2">
          <span className="text-slate-400">SHA-256 Hash:</span> 
          <span className="text-[10px] break-all text-slate-600 dark:text-slate-400">{caseData.hashValue}</span>
        </p>
        <p className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-800/30 pb-2">
          <span className="text-slate-400">Investigator:</span> 
          <span className="text-slate-700 dark:text-slate-300">{caseData.investigator}</span>
        </p>
        <p className="flex justify-between items-center text-xs pb-1">
          <span className="text-slate-400">Status:</span> 
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            caseData.status.toLowerCase() === 'verified'
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>{caseData.status}</span>
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Threat Score</p>
          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{caseData.threatScore}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getThreatColor(caseData.threatScore)}`}
            style={{ width: `${caseData.threatScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}