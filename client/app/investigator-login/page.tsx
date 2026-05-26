"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Terminal, User } from "lucide-react";

export default function InvestigatorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid Credentials. Use admin@forensics.com / password123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/95 border border-slate-700 rounded-3xl shadow-2xl p-8"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-[10px] tracking-[0.35em] uppercase text-emerald-300 font-bold mb-4">
            [ AUTHORIZED INVESTIGATORS ONLY ]
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20">
              <Terminal className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Forensic Pro Suite – Secure Investigator Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Enter your credentials to access the investigator dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="agent@forensics.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400"
          >
            Enter Secure Portal
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-slate-400 text-xs text-center">
          <p>Only authorized investigators may access this portal.</p>
          <p className="mt-3">
            Need help? <a href="mailto:akshayshibu473@gmail.com" className="text-emerald-400 hover:text-emerald-300">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
