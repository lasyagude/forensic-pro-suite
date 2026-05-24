"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      // Hysteresis: show at 400px, hide only below 350px
      // prevents toggling from Live Threat Feed page height shifts
      setVisible((prev) => {
        if (!prev && scrollTop > 400) return true;
        if (prev && scrollTop < 350) return false;
        return prev;
      });

      setScrollPercent(percent);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          title={`Back to top (${scrollPercent}% scrolled)`}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-full"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-12 h-12 -rotate-90"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            {/* Background ring */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="rgba(16,185,129,0.15)"
              strokeWidth="3"
            />
            {/* Progress ring */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.15s linear" }}
            />
          </svg>

          {/* Inner button */}
          <span className="relative z-10 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-950 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ArrowUp className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}