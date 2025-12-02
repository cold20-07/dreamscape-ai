"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { VoiceInput } from "@/components/common/VoiceInput";

interface GuidedDreamWizardProps {
    onComplete: (summary: string, tags: string[]) => void;
}

const questions = [
    {
        id: "emotion",
        question: "How did you feel when you woke up?",
        options: ["Anxious", "Excited", "Confused", "Peaceful", "Scared", "Inspired"],
        multi: true
    },
    {
        id: "setting",
        question: "Where did the dream take place?",
        placeholder: "e.g., My childhood home, a forest, space..."
    },
    {
        id: "characters",
        question: "Who was with you?",
        placeholder: "e.g., My brother, a stranger, a talking cat..."
    },
    {
        id: "plot",
        question: "What was the main event?",
        placeholder: "Describe the key action..."
    },
    {
        id: "vivid",
        question: "What is the most vivid detail you remember?",
        placeholder: "A color, a sound, a sensation..."
    }
];

export function GuidedDreamWizard({ onComplete }: GuidedDreamWizardProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isCompleting, setIsCompleting] = useState(false);

    // Sound Effects (Placeholders)
    const playClick = useSound("/sounds/click.mp3");
    const playSuccess = useSound("/sounds/success.mp3");

    const handleNext = () => {
        playClick();
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsCompleting(true);
            playSuccess();
            setTimeout(() => {
                compileDream();
            }, 1500);
        }
    };

    const handleBack = () => {
        playClick();
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleAnswer = (value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [questions[step].id]: value }));
    };

    const toggleOption = (option: string) => {
        playClick();
        const current = answers[questions[step].id];
        const currentArray = Array.isArray(current) ? current : [];

        if (currentArray.includes(option)) {
            handleAnswer(currentArray.filter((i: string) => i !== option));
        } else {
            handleAnswer([...currentArray, option]);
        }
    };

    const compileDream = () => {
        const emotion = answers.emotion;
        const emotionArray = Array.isArray(emotion) ? emotion : emotion ? [emotion] : [];

        const summary = `
I felt ${emotionArray.join(", ") || "something"}.
The dream took place in ${answers.setting || "an unknown place"}.
I was with ${answers.characters || "no one"}.
The main event was: ${answers.plot || "unclear"}.
The most vivid detail was ${answers.vivid || "fading"}.
        `.trim();

        onComplete(summary, emotionArray);
    };

    const currentQ = questions[step];

    if (isCompleting) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="bg-mantis-green text-black p-6 rounded-full mb-6"
                >
                    <Check size={48} />
                </motion.div>
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Dream Recorded
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/60"
                >
                    Weaving it into the universe...
                </motion.p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-[400px] justify-between relative">
            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-mantis-green to-emerald-400 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col gap-6"
                >
                    <div className="flex items-center gap-2 text-mantis-green text-sm font-bold tracking-wider uppercase">
                        <Sparkles size={14} />
                        <span>Step {step + 1} of {questions.length}</span>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                        {currentQ.question}
                    </h3>

                    {currentQ.options ? (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {currentQ.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => toggleOption(opt)}
                                    className={`px-6 py-3 rounded-full border transition-all duration-300 ${(answers[currentQ.id] || []).includes(opt)
                                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform scale-105"
                                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:bg-white/10"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="relative mt-4">
                            <textarea
                                value={answers[currentQ.id] || ""}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder={currentQ.placeholder}
                                className="w-full bg-transparent border-b border-white/20 py-4 text-xl md:text-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-mantis-green transition-colors resize-none min-h-[120px]"
                                autoFocus
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                <div className="text-xs text-white/20 mr-2">Press Enter to continue</div>
                                <VoiceInput
                                    onResult={(text) => {
                                        const current = (answers[currentQ.id] as string) || "";
                                        handleAnswer(current + (current ? " " : "") + text);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-8 border-t border-white/10">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : "text-white/60 hover:text-white"
                        }`}
                >
                    <ChevronLeft size={16} /> Back
                </button>
                <button
                    onClick={handleNext}
                    className="group flex items-center gap-2 text-sm uppercase tracking-wider text-white hover:text-mantis-green transition-colors"
                >
                    {step === questions.length - 1 ? "Finish" : "Next"}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
