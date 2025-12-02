"use client";

import { motion } from "framer-motion";
import { User, MapPin } from "lucide-react";

interface EntityCardProps {
    type: 'character' | 'location';
    name: string;
    description?: string;
    appearances: number;
    subtext?: string;
    index: number;
}

export function EntityCard({ type, name, description, appearances, subtext, index }: EntityCardProps) {
    const Icon = type === 'character' ? User : MapPin;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                    <Icon size={20} className="text-white/80" />
                </div>
                <span className="text-xs uppercase tracking-widest text-mantis-gray">
                    {appearances} {appearances === 1 ? 'Dream' : 'Dreams'}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                {name}
            </h3>

            {subtext && (
                <p className="text-xs uppercase tracking-wider text-mantis-gray/60 mb-3">
                    {subtext}
                </p>
            )}

            {description && (
                <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
