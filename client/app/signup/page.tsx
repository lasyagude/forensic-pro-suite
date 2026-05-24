"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  UserPlus,
  AlertCircle,
} from "lucide-react";

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Temporary frontend-only success flow
      // Replace with backend API later

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-emerald-500/30 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20">
              <UserPlus className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="text-slate-500 text-xs mt-2 font-mono uppercase tracking-widest">
            Investigator Registration Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type="email"
                placeholder="agent@forensics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition uppercase text-xs tracking-widest"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-emerald-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}