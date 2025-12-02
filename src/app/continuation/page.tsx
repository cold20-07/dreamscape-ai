"use client";

import { ContinuationCard } from "@/components/continuation/ContinuationCard";
import { useDreams } from "@/context/DreamContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Dream } from "@/types";

export default function ContinuationPage() {
    const { dreams } = useDreams();
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

    useEffect(() => {
        // Only run this once on mount if we have dreams and no selection
        if (dreams.length > 0 && !selectedDream) {
            // Use a timeout to avoid synchronous state update warning during render phase
            const timer = setTimeout(() => {
                const randomDream = dreams[Math.floor(Math.random() * dreams.length)];
                setSelectedDream(randomDream);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [dreams, selectedDream]);

    return (
        <div className="max-w-4xl mx-auto text-center space-y-12 pt-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-accent">
                    Dream Continuation
                </h1>
                <p className="text-white/60 max-w-xl mx-auto">
                    Review a past dream and receive an AI-generated prompt to guide your subconscious before you sleep.
                </p>
            </motion.div>

            {selectedDream ? (
                <ContinuationCard
                    dream={selectedDream}
                    onRefresh={() => {
                        if (dreams.length > 0) {
                            const randomDream = dreams[Math.floor(Math.random() * dreams.length)];
                            setSelectedDream(randomDream);
                        }
                    }}
                />
            ) : (
                <div className="text-white/40">
                    <p>No dreams recorded yet. Start by adding a dream to your journal.</p>
                </div>
            )}
        </div>
    );
}
