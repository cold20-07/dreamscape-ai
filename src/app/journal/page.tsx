"use client";

import { useState } from "react";
import { DreamList } from "@/components/journal/DreamList";
import { AddDreamForm } from "@/components/journal/AddDreamForm";
import { AnimatePresence } from "framer-motion";

export default function JournalPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="fixed top-32 left-8 z-40">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-mantis-white mix-blend-difference opacity-20 select-none pointer-events-none">
                    JOURNAL
                </h1>
            </div>

            <div className="fixed bottom-8 right-8 z-40">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="group flex items-center gap-4 text-mantis-white hover:text-white transition-colors"
                >
                    <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0">
                        Record Dream
                    </span>
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                        <span className="text-2xl font-light leading-none mb-1">+</span>
                    </div>
                </button>
            </div>

            <DreamList />

            <AnimatePresence>
                {isAddModalOpen && (
                    <AddDreamForm onClose={() => setIsAddModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
