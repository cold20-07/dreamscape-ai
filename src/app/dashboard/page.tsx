"use client";

import { useDreams } from "@/context/DreamContext";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentDreams } from "@/components/dashboard/RecentDreams";
import { ContinuationPrompt } from "@/components/dream/ContinuationPrompt";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { stats, dreams } = useDreams();

    // Fallback stats if null (e.g. loading)
    const safeStats = stats || {
        totalDreams: dreams.length,
        streak: 0,
        lastRecorded: null,
        averageClarity: 0,
        averageSentiment: 0
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                    DASHBOARD
                </h1>
                <p className="text-mantis-gray text-lg">
                    Welcome back to your subconscious.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard label="Total Dreams" value={safeStats.totalDreams} delay={0.1} />
                <StatsCard label="Current Streak" value={`${safeStats.streak} Days`} delay={0.2} />
                <StatsCard label="Avg Clarity" value={`${safeStats.averageClarity}/10`} delay={0.3} />
                <StatsCard label="Avg Sentiment" value={safeStats.averageSentiment > 0.5 ? "Positive" : "Neutral"} delay={0.4} />
            </div>

            <QuickActions />

            <ContinuationPrompt />

            <RecentDreams />
        </div>
    );
}
