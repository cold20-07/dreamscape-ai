"use client";

import { useDreams } from "@/context/DreamContext";
import { motion } from "framer-motion";

export function DreamList() {
    const { dreams, deleteDream } = useDreams();

    if (dreams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-mantis-gray">
                <p className="text-lg tracking-wide">No dreams recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-20 px-4">
            <div className="grid gap-12">
                {dreams.map((dream, index) => (
                    <motion.div
                        key={dream.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative border-b border-white/10 pb-12 last:border-0"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs font-mono text-mantis-gray">
                                    {new Date(dream.date).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="text-xs uppercase tracking-widest text-mantis-gray/50">
                                    {dream.type}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-mantis-white group-hover:text-white transition-colors">
                                {dream.title}
                            </h2>

                            <p className="text-lg text-mantis-gray leading-relaxed line-clamp-3 group-hover:text-mantis-white/80 transition-colors">
                                {dream.content}
                            </p>

                            <div className="flex gap-2 mt-4">
                                {dream.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider border border-white/10 px-2 py-1 rounded-full text-mantis-gray">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => deleteDream(dream.id)}
                                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-400 uppercase tracking-widest"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
