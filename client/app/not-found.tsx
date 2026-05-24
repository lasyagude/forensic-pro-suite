import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20">
            <Shield className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white font-mono">404</h1>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Page Not Found</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The evidence trail ends here. This page does not exist or has been moved to a secure location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-emerald-900/20 uppercase text-xs tracking-widest active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-600 dark:text-slate-400 hover:text-emerald-500 font-bold py-3 px-6 rounded-xl transition uppercase text-xs tracking-widest"
          >
            Go to Login
          </Link>
        </div>

        <p className="text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em]">
          Error Code: EVIDENCE_NOT_FOUND
        </p>
      </div>
    </div>
  );
}
