"use client";

import { SentimentChart } from "@/components/insights/SentimentChart";
import { TagCloud } from "@/components/insights/TagCloud";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function InsightsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen pt-32 px-8 pb-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
                        INSIGHTS
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl">
                        Uncover hidden patterns in your subconscious. Analyze sentiment trends and recurring themes.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 bg-mantis-green rounded-full"></span>
                            Emotional Resonance
                        </h2>
                        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 h-[400px] flex items-center justify-center">
                            <SentimentChart />
                        </div>
                        <p className="mt-4 text-sm text-white/40">
                            Tracking the emotional valence of your dreams over time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Recurring Themes
                        </h2>
                        <TagCloud />
                        <p className="mt-4 text-sm text-white/40">
                            Frequency analysis of tags and symbols appearing in your journal.
                        </p>
                    </section>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
