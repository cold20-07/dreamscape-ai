"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    delay?: number;
}

export function StatsCard({ label, value, subtext, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
        >
            <h3 className="text-xs uppercase tracking-widest text-mantis-gray mb-2">{label}</h3>
            <div className="text-4xl font-bold text-white mb-1">{value}</div>
            {subtext && <p className="text-xs text-white/40">{subtext}</p>}
        </motion.div>
    );
}
