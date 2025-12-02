"use client";

import { useState, useEffect } from "react";
import { useDreams } from "@/context/DreamContext";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export function ContinuationPrompt() {
    const { dreams } = useDreams();
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dreams.length > 0 && !prompt) {
            // Use a timeout to avoid setting state synchronously in effect
            const initTimer = setTimeout(() => {
                setLoading(true);
                // Mock AI generation based on recent dreams
                const timer = setTimeout(() => {
                    const recentDreams = dreams.slice(0, 3);
                    const themes = recentDreams.flatMap(d => d.tags).slice(0, 3);
                    const characters = recentDreams.flatMap(d => d.characterIds).length;

                    const templates = [
                        `Tonight, try to revisit the ${themes[0] || "world"} you saw recently. Look for details you missed.`,
                        `If you see ${characters > 0 ? "that character" : "anyone"} again, ask them what they represent.`,
                        `Focus on the feeling of ${themes[1] || "flying"} and see if you can control it this time.`,
                        `Before you sleep, visualize the location from your last dream. Imagine opening a door there.`,
                        `You've been dreaming about ${themes.join(", ")}. Tonight, ask the dream for clarity.`
                    ];

                    const randomPrompt = templates[Math.floor(Math.random() * templates.length)];
                    setPrompt(randomPrompt);
                    setLoading(false);
                }, 1500);
                return () => clearTimeout(timer);
            }, 0);
            return () => clearTimeout(initTimer);
        }
    }, [dreams, prompt]);

    if (dreams.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50" />

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-purple-300">
                    <Sparkles size={16} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Tonight&apos;s Prompt</h3>
                </div>
                <button
                    onClick={() => setPrompt("")} // Trigger regeneration by clearing prompt
                    disabled={loading}
                    className={`p-2 hover:bg-white/5 rounded-full transition-colors ${loading ? "animate-spin" : ""}`}
                >
                    <RefreshCw size={14} className="text-white/40 hover:text-white" />
                </button>
            </div>

            <div className="min-h-[60px] flex items-center">
                {loading ? (
                    <div className="flex gap-1">
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-white/40 rounded-full" />
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-white/40 rounded-full" />
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={prompt}
                        className="text-xl font-medium text-white leading-relaxed"
                    >
                        &quot;{prompt}&quot;
                    </motion.p>
                )}
            </div>
        </div>
    );
}
