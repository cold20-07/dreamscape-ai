"use client";

import { useMemo } from "react";
import { useDreams } from "@/context/DreamContext";
import { motion } from "framer-motion";

export function SentimentChart() {
    const { dreams } = useDreams();

    const data = useMemo(() => {
        // Sort dreams by date
        const sortedDreams = [...dreams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Take last 20 dreams for the chart
        const recentDreams = sortedDreams.slice(-20);

        return recentDreams.map(dream => {
            let sentiment = 0; // Neutral
            if (dream.type === 'lucid') sentiment = 1; // Positive
            if (dream.type === 'nightmare') sentiment = -1; // Negative

            return {
                date: new Date(dream.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                sentiment,
                title: dream.title
            };
        });
    }, [dreams]);

    if (data.length < 2) {
        return <div className="text-white/40 text-center py-10">Not enough data for sentiment analysis.</div>;
    }

    // Chart dimensions
    const width = 800;
    const height = 300;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Scales
    const xScale = (index: number) => padding + (index / (data.length - 1)) * graphWidth;
    const yScale = (sentiment: number) => padding + graphHeight / 2 - (sentiment * (graphHeight / 2));

    // Generate path
    const pathD = data.reduce((path, point, i) => {
        const x = xScale(i);
        const y = yScale(point.sentiment);
        return i === 0 ? `M ${x},${y}` : `${path} L ${x},${y}`;
    }, "");

    // Generate area path (for gradient fill)
    const areaD = `${pathD} L ${xScale(data.length - 1)},${height - padding} L ${padding},${height - padding} Z`;

    return (
        <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[600px]">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    <defs>
                        <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="white" strokeOpacity="0.1" strokeDasharray="4" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="white" strokeOpacity="0.1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="white" strokeOpacity="0.1" strokeDasharray="4" />

                    {/* Labels */}
                    <text x={padding - 10} y={padding + 5} fill="white" fillOpacity="0.5" textAnchor="end" fontSize="10">Positive</text>
                    <text x={padding - 10} y={height / 2 + 5} fill="white" fillOpacity="0.5" textAnchor="end" fontSize="10">Neutral</text>
                    <text x={padding - 10} y={height - padding + 5} fill="white" fillOpacity="0.5" textAnchor="end" fontSize="10">Negative</text>

                    {/* Area Fill */}
                    <motion.path
                        d={areaD}
                        fill="url(#sentimentGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>

                    {/* Points */}
                    {data.map((point, i) => (
                        <g key={i} className="group">
                            <circle
                                cx={xScale(i)}
                                cy={yScale(point.sentiment)}
                                r="4"
                                fill="white"
                                className="transition-all duration-300 group-hover:r-6"
                            />
                            {/* Tooltip */}
                            <foreignObject x={xScale(i) - 50} y={yScale(point.sentiment) - 60} width="100" height="50" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded p-2 text-center">
                                    <div className="text-[10px] text-white/60">{point.date}</div>
                                    <div className="text-xs font-bold text-white truncate">{point.title}</div>
                                </div>
                            </foreignObject>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
