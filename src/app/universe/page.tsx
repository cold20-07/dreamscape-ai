"use client";

import { useState } from "react";
import { UniverseCanvas } from "@/components/universe/UniverseCanvas";
import { TimelineView } from "@/components/journal/TimelineView";
import { DreamModal } from "@/components/journal/DreamModal";
import { Dream } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Box } from "lucide-react";

export default function UniversePage() {
    const [viewMode, setViewMode] = useState<'universe' | 'timeline'>('universe');
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-32 left-8 z-10 pointer-events-none flex flex-col gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white drop-shadow-lg"
                    >
                        Dream Universe
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-sm"
                    >
                        Explore the connections between your dreams.
                    </motion.p>
                </div>

                <div className="pointer-events-auto flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 w-fit">
                    <button
                        onClick={() => setViewMode('universe')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'universe' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                        title="3D Universe"
                    >
                        <Box size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'timeline' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                        title="Timeline View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            <div className="w-full h-[calc(100vh-4rem)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#020205]">
                {viewMode === 'universe' ? (
                    <UniverseCanvas />
                ) : (
                    <TimelineView onSelectDream={setSelectedDream} />
                )}
            </div>

            <AnimatePresence>
                {selectedDream && (
                    <DreamModal
                        dream={selectedDream}
                        onClose={() => setSelectedDream(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
