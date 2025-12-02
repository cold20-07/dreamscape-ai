"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { modalBackdrop, modalContent } from "@/lib/animations";

export function OnboardingWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasOnboarded = localStorage.getItem("dreamscape_onboarded");
        if (!hasOnboarded) {
            // Small delay to allow the app to load first
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem("dreamscape_onboarded", "true");
        setIsOpen(false);
    };

    const steps = [
        {
            title: "Welcome to DreamScape",
            description: "Your personal gateway to the subconscious. Record, analyze, and explore your dreams in a living digital universe.",
            icon: "🌌"
        },
        {
            title: "Record Everything",
            description: "Use voice, text, or sketches to capture every detail. The more you record, the more the universe expands.",
            icon: "🎙️"
        },
        {
            title: "Discover Patterns",
            description: "Our pattern engine will find connections between your dreams, revealing hidden meanings and recurring themes.",
            icon: "✨"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        variants={modalBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />
                    <motion.div
                        variants={modalContent}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative bg-black border border-white/20 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-mantis-green/10 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mb-8"
                            >
                                <div className="text-6xl mb-6">{steps[step].icon}</div>
                                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                                    {steps[step].title}
                                </h2>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    {steps[step].description}
                                </p>
                            </motion.div>

                            <div className="flex items-center justify-center gap-2 mb-8">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-white" : "w-2 bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (step < steps.length - 1) {
                                        setStep(step + 1);
                                    } else {
                                        handleComplete();
                                    }
                                }}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                            >
                                {step < steps.length - 1 ? (
                                    <>
                                        Next <ArrowRight size={20} />
                                    </>
                                ) : (
                                    <>
                                        Enter DreamScape <Check size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
