"use client";

import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
    id: string;
    name: string;
    color: string;
}

const tracks: Track[] = [
    { id: "rain", name: "Heavy Rain", color: "#60a5fa" },
    { id: "forest", name: "Night Forest", color: "#4ade80" },
    { id: "waves", name: "Ocean Waves", color: "#2dd4bf" },
    { id: "white", name: "White Noise", color: "#a8a29e" },
    { id: "binaural", name: "Theta Waves", color: "#c084fc" },
];

export function SoundscapePlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Mock audio element (in a real app, this would be an <audio> tag)
    // For now, we just simulate the state

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-24 right-8 z-40 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Soundscapes</h3>
                            <Music size={14} className="text-white/40" />
                        </div>

                        <div className="space-y-2 mb-4">
                            {tracks.map(track => (
                                <button
                                    key={track.id}
                                    onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentTrack.id === track.id
                                        ? "bg-white/10 text-white"
                                        : "hover:bg-white/5 text-white/60 hover:text-white"
                                        }`}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: track.color }}
                                    />
                                    <span className="text-sm">{track.name}</span>
                                    {currentTrack.id === track.id && isPlaying && (
                                        <motion.div
                                            className="ml-auto flex gap-0.5 items-end h-3"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {[1, 2, 3].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                                                    className="w-0.5 bg-white/60"
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md border shadow-lg transition-all ${isPlaying
                    ? "bg-mantis-green text-black border-mantis-green"
                    : "bg-black/80 text-white border-white/10 hover:border-white/30"
                    }`}
            >
                <div onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </div>
                {isPlaying && (
                    <span className="text-sm font-bold pr-1">{currentTrack.name}</span>
                )}
            </motion.button>
        </div>
    );
}
