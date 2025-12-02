"use client";

import { useMemo, useState } from "react";
import { useDreams } from "@/context/DreamContext";
import { Dream } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface DayData {
    date: string;
    count: number;
    dreams: Dream[];
    intensity: number; // 0-4 scale
}

export function CalendarHeatmap() {
    const { dreams } = useDreams();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const heatmapData = useMemo(() => {
        const today = new Date();
        const data: DayData[] = [];
        const daysToRender = 365;

        // Create a map of date strings to dreams
        const dreamsByDate = new Map<string, Dream[]>();
        dreams.forEach(dream => {
            const dateStr = new Date(dream.date).toISOString().split('T')[0];
            if (!dreamsByDate.has(dateStr)) {
                dreamsByDate.set(dateStr, []);
            }
            dreamsByDate.get(dateStr)?.push(dream);
        });

        // Generate last 365 days
        for (let i = daysToRender; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const daysDreams = dreamsByDate.get(dateStr) || [];
            const count = daysDreams.length;

            // Calculate intensity (0-4)
            let intensity = 0;
            if (count > 0) intensity = 1;
            if (count > 1) intensity = 2;
            if (count > 2) intensity = 3;
            if (count > 4) intensity = 4;

            data.push({
                date: dateStr,
                count,
                dreams: daysDreams,
                intensity
            });
        }
        return data;
    }, [dreams]);

    const getIntensityColor = (intensity: number) => {
        switch (intensity) {
            case 0: return "bg-white/5";
            case 1: return "bg-mantis-green/20";
            case 2: return "bg-mantis-green/40";
            case 3: return "bg-mantis-green/60";
            case 4: return "bg-mantis-green";
            default: return "bg-white/5";
        }
    };

    const selectedDayData = useMemo(() => {
        if (!selectedDate) return null;
        return heatmapData.find(d => d.date === selectedDate);
    }, [selectedDate, heatmapData]);

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 overflow-x-auto custom-scrollbar">
                <div className="flex gap-1 min-w-max">
                    {/* We render columns of 7 days (weeks) */}
                    {Array.from({ length: Math.ceil(heatmapData.length / 7) }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {heatmapData.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => (
                                <motion.button
                                    key={day.date}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} ${selectedDate === day.date ? 'ring-1 ring-white' : ''}`}
                                    title={`${day.date}: ${day.count} dreams`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedDayData && selectedDayData.dreams.length > 0 ? (
                    <motion.div
                        key={selectedDate}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {selectedDayData.dreams.map(dream => (
                            <div key={dream.id} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">{dream.title}</h3>
                                <p className="text-white/60 text-sm line-clamp-3 mb-4">{dream.content}</p>
                                <div className="flex gap-2">
                                    {dream.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded text-white/40">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : selectedDate ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-white/40"
                    >
                        No dreams recorded on {new Date(selectedDate).toLocaleDateString()}.
                    </motion.div>
                ) : (
                    <div className="text-center py-12 text-white/40">
                        Select a day to view dreams.
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
