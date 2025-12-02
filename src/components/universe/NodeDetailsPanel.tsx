"use client";

import { Dream } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Tag, ArrowRight, ArrowLeft } from "lucide-react";

interface NodeDetailsPanelProps {
    dream: Dream | null;
    onClose: () => void;
    onViewFull: (dream: Dream) => void;
}

export function NodeDetailsPanel({ dream, onClose, onViewFull }: NodeDetailsPanelProps) {
    return (
        <AnimatePresence>
            {dream && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-[#050510]/90 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col shadow-2xl"
                >
                    <div className="p-8 pt-12 pb-0 flex-none">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium uppercase tracking-wider">Back</span>
                        </button>
                    </div>

                    <div className="p-8 pt-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-mantis-green mb-4">
                            <Calendar size={12} />
                            {new Date(dream.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                            {dream.title}
                        </h2>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {dream.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 border border-white/10 flex items-center gap-1">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed">
                            <p className="line-clamp-[10] whitespace-pre-wrap">
                                {dream.content}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-white/10 mt-auto">
                        <div className="pt-6">
                            <button
                                onClick={() => onViewFull(dream)}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-mantis-green transition-colors"
                            >
                                View Full Entry <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
