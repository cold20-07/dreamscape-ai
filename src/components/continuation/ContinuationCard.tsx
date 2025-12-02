"use client";

import { motion } from "framer-motion";
import { Dream } from "@/types";
import { Moon, RefreshCw } from "lucide-react";
import { useState } from "react";

export function ContinuationCard({ dream, onRefresh }: { dream: Dream; onRefresh: () => void }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState<string | null>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Mock AI generation
        setTimeout(() => {
            setPrompt(
                `Focus on the feeling of ${dream.sentiment > 0.5 ? "joy" : "unease"} from "${dream.title}". Imagine the scene shifting... what happens if you turn left instead of right? Visualise the ${dream.tags[0] || "environment"} changing colors.`
            );
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-2xl mx-auto text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Moon className="w-8 h-8 text-secondary" />
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">{dream.title}</h2>
            <p className="text-white/60 mb-8 line-clamp-3 italic">&quot;{dream.content}&quot;</p>

            {!prompt ? (
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Generating Prompt...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Generate Continuation Prompt
                        </>
                    )}
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 p-6 rounded-xl border border-white/10 text-left"
                >
                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Before Sleep Visualization</h3>
                    <p className="text-lg leading-relaxed">{prompt}</p>

                    <div className="mt-6 flex justify-center">
                        <button onClick={onRefresh} className="text-sm text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                            <RefreshCw className="w-3 h-3" />
                            Try another dream
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function SparklesIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}
