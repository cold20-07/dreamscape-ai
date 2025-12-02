"use client";

import { useMemo } from "react";
import { useDreams } from "@/context/DreamContext";
import { motion } from "framer-motion";

export function TagCloud() {
    const { dreams } = useDreams();

    const tagData = useMemo(() => {
        const counts = new Map<string, number>();
        dreams.forEach(dream => {
            dream.tags.forEach(tag => {
                counts.set(tag, (counts.get(tag) || 0) + 1);
            });
        });

        // Convert to array and sort by count
        return Array.from(counts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 30); // Top 30 tags
    }, [dreams]);

    if (tagData.length === 0) {
        return <div className="text-white/40 text-center py-10">No tags recorded yet.</div>;
    }

    const maxCount = Math.max(...tagData.map(d => d.count));
    const minCount = Math.min(...tagData.map(d => d.count));

    const getFontSize = (count: number) => {
        // Scale between 0.8rem and 3rem
        if (maxCount === minCount) return "1.5rem";
        const scale = (count - minCount) / (maxCount - minCount);
        return `${0.8 + scale * 2.2}rem`;
    };

    const getOpacity = (count: number) => {
        if (maxCount === minCount) return 1;
        const scale = (count - minCount) / (maxCount - minCount);
        return 0.4 + scale * 0.6;
    };

    return (
        <div className="flex flex-wrap justify-center gap-4 p-8 bg-black/20 border border-white/10 rounded-2xl">
            {tagData.map((item, index) => (
                <motion.span
                    key={item.tag}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: getOpacity(item.count), scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="font-bold text-white cursor-default hover:text-mantis-green transition-colors"
                    style={{ fontSize: getFontSize(item.count) }}
                    title={`${item.count} occurrences`}
                >
                    {item.tag}
                </motion.span>
            ))}
        </div>
    );
}
