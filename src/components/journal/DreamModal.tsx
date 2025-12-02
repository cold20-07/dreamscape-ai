"use client";

import { Dream } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag } from "lucide-react";
import { modalBackdrop, modalContent } from "@/lib/animations";

import { useDreams } from "@/context/DreamContext";

interface DreamModalProps {
    dream: Dream | null;
    onClose: () => void;
}

export function DreamModal({ dream, onClose }: DreamModalProps) {
    const { dreams } = useDreams();
    const relatedDreams = dream ? dreams.filter(d => dream.relatedDreamIds?.includes(d.id)) : [];

    return (
        <AnimatePresence>
            {dream && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        variants={modalBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        variants={modalContent}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative bg-black minimal-border rounded-2xl p-8 md:p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full smooth-transition"
                        >
                            <X className="w-6 h-6 text-white/60 hover:text-white" />
                        </button>

                        <div className="pr-12">
                            <div className="mb-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    {dream.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-white/50">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(dream.date).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                    <span className="px-3 py-1 rounded-full minimal-border text-xs">
                                        {dream.type}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-lg md:text-xl text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {dream.content}
                                </p>
                            </div>

                            {dream.tags.length > 0 && (
                                <div className="mb-8">
                                    <div className="text-sm text-white/40 mb-3">Tags</div>
                                    <div className="flex flex-wrap gap-2">
                                        {dream.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full minimal-border text-white/60"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                <div>
                                    <div className="text-sm text-white/40 mb-2">Clarity</div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full smooth-transition"
                                                style={{ width: `${(dream.clarity / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-lg font-medium">{dream.clarity}/10</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-white/40 mb-2">Sentiment</div>
                                    <div className="text-lg font-medium">
                                        {dream.sentiment > 0.6 ? 'Positive' :
                                            dream.sentiment < 0.4 ? 'Negative' : 'Neutral'}
                                    </div>
                                </div>
                            </div>

                            {relatedDreams.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="text-sm text-white/40 mb-4">Related Dreams</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {relatedDreams.map(related => (
                                            <div key={related.id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
                                                <div className="text-sm font-bold text-white mb-1">{related.title}</div>
                                                <div className="text-xs text-white/40 line-clamp-2">{related.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
