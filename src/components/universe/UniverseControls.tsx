"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UniverseControlsProps {
    onSearch: (query: string) => void;
    onFilterTags: (tags: string[]) => void;
    availableTags: string[];
}

export function UniverseControls({ onSearch, onFilterTags, availableTags }: UniverseControlsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        onSearch(searchQuery);
    }, [searchQuery, onSearch]);

    useEffect(() => {
        onFilterTags(selectedTags);
    }, [selectedTags, onFilterTags]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    return (
        <div className="absolute top-48 md:top-24 right-8 z-10 flex flex-col gap-4 w-full max-w-[200px] md:max-w-xs pointer-events-none">
            {/* Search Bar */}
            <div className="pointer-events-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-white/40 group-focus-within:text-white transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dreams..."
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-full leading-5 bg-black/40 text-white placeholder-white/40 focus:outline-none focus:bg-black/60 focus:border-white/30 backdrop-blur-md transition-all"
                />
            </div>

            {/* Filter Toggle */}
            <div className="pointer-events-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all ${isOpen || selectedTags.length > 0
                        ? "bg-white text-black border-white"
                        : "bg-black/40 text-white/60 border-white/10 hover:bg-black/60 hover:text-white"
                        }`}
                >
                    <Filter size={14} />
                    <span className="text-sm font-medium">Filters {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
                </button>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs uppercase tracking-widest text-white/60">Filter by Tag</h3>
                            {selectedTags.length > 0 && (
                                <button
                                    onClick={() => setSelectedTags([])}
                                    className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-all ${selectedTags.includes(tag)
                                        ? "bg-white text-black border-white"
                                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
