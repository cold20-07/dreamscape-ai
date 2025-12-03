"use client";

import { CalendarHeatmap } from "@/components/timeline/CalendarHeatmap";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function TimelinePage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen pt-32 px-8 pb-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
                        TIMELINE
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl">
                        Visualize your dreaming patterns over time. Every dot represents a night of exploration.
                    </p>
                </header>

                <CalendarHeatmap />
            </div>
        </div>
        </ProtectedRoute>
    );
}
