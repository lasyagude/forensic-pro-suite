"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay from "./TutorialOverlay";

const lessons = [
  { title: "Welcome", text: "Investigator, I am your Forensic Assistant. This workstation has been significantly upgraded by Babin for high-fidelity triage.", targetId: undefined },
  { title: "Enhanced Identification", text: "Babin added Dual-Hash verification. We now verify integrity using BOTH SHA-256 and MD5 simultaneously for zero-collision confidence.", targetId: "tool-automated-flow" },
  { title: "Deep Forensic Analysis", text: "Beyond just extension checks, Babin implemented Magic Number (Signature) verification to detect spoofed files and hidden executables.", targetId: "tool-automated-flow" },
  { title: "Advanced Metadata", text: "We now extract deep artifact data including accessed timestamps, permissions, and threat levels, thanks to Babin's engine overhaul.", targetId: "tool-automated-flow" },
  { title: "Final Step: Reporting", text: "Babin enhanced the reporting logic to include these advanced metrics. Click 'Automated Flow' to generate a Babin-modified PDF report.", targetId: "tool-automated-flow" },
];

export default function RobotAssistant() {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedStep = localStorage.getItem("forensic_robot_step");
    if (savedStep) setStep(parseInt(savedStep));
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (step < lessons.length - 1) {
      const next = step + 1;
      setStep(next);
      localStorage.setItem("forensic_robot_step", next.toString());
    } else {
      localStorage.removeItem("forensic_robot_step");
      setIsVisible(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    localStorage.setItem("forensic_robot_step", "0");
    setIsVisible(true);
  };

  return (
    <>
      <TutorialOverlay active={isVisible} targetId={lessons[step].targetId} />
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-8 right-8 flex flex-col items-end z-50"
          >
            <div className="bg-slate-900 border-2 border-emerald-500 p-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4 max-w-[280px] text-white">
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
                {lessons[step].title}
              </h4>
              <p className="text-sm leading-relaxed text-slate-200">{lessons[step].text}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-emerald-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20"
                >
                  {step === lessons.length - 1 ? "Start Mission" : "Understand"}
                </button>
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="bg-slate-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-600 transition"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={handleReset}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(16,185,129,0.6)] cursor-pointer"
            >
              🤖
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}