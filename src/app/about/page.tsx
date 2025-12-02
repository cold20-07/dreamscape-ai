"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center space-y-8"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-mantis-white mix-blend-difference">
                    ABOUT DREAMSCAPE
                </h1>
                <p className="text-xl text-mantis-gray leading-relaxed">
                    DreamScape is a digital sanctuary for your subconscious.
                    We believe that dreams are the unwritten stories of our lives,
                    waiting to be explored and understood.
                </p>
                <div className="pt-8">
                    <p className="text-sm uppercase tracking-widest text-mantis-gray/50">
                        Version 1.0.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
