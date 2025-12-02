"use client";

import { useDreams } from "@/context/DreamContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RecentDreams() {
    const { dreams } = useDreams();
    const recent = dreams.slice(0, 5);

    if (recent.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <p className="text-mantis-gray mb-4">No dreams recorded yet.</p>
                <Link href="/journal?action=new" className="text-white underline underline-offset-4 hover:text-white/80">
                    Record your first dream
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-widest text-mantis-gray">Recent Dreams</h2>
                <Link href="/journal" className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recent.map((dream, index) => (
                    <Link key={dream.id} href={`/journal?id=${dream.id}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="group h-full bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full justify-between gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-mantis-gray font-mono">
                                            {new Date(dream.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider opacity-50">
                                            {dream.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:underline underline-offset-4 decoration-1">
                                        {dream.title}
                                    </h3>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {dream.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
