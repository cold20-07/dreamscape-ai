"use client";

import { useDreams } from "@/context/DreamContext";
import { Dream } from "@/types";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface TimelineViewProps {
    onSelectDream: (dream: Dream) => void;
}

export function TimelineView({ onSelectDream }: TimelineViewProps) {
    const { dreams } = useDreams();

    // Sort dreams by date descending
    const sortedDreams = [...dreams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">Dream Timeline</h2>

                <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12 pb-20">
                    {sortedDreams.map((dream, index) => (
                        <motion.div
                            key={dream.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-12 group cursor-pointer"
                            onClick={() => onSelectDream(dream)}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-mantis-green shadow-[0_0_10px_rgba(74,222,128,0.5)] group-hover:scale-150 transition-transform" />

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:translate-x-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <Calendar size={14} />
                                        {new Date(dream.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex gap-2">
                                        {dream.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 border border-white/10">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-mantis-green transition-colors">
                                    {dream.title}
                                </h3>

                                <p className="text-white/70 line-clamp-3 mb-4 leading-relaxed">
                                    {dream.content}
                                </p>

                                <div className="flex items-center text-mantis-green text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                    Read Entry <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {sortedDreams.length === 0 && (
                        <div className="text-center text-white/40 py-20">
                            No dreams recorded yet. Start dreaming...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
