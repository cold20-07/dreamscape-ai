"use client";

import { useState, useCallback } from "react";
import { useDreams } from "@/context/DreamContext";
import { Dream } from "@/types";
import { motion } from "framer-motion";
import { X, User, MapPin, Type, Mic, PenTool, Sparkles } from "lucide-react";
import { RichTextEditor } from "./editor/RichTextEditor";
import { VoiceRecorder } from "./editor/VoiceRecorder";
import { DreamCanvas } from "./editor/DreamCanvas";
import { GuidedDreamWizard } from "./editor/GuidedDreamWizard";

interface AddDreamFormProps {
    onClose: () => void;
}

type InputMode = 'text' | 'voice' | 'sketch' | 'guided';

export function AddDreamForm({ onClose }: AddDreamFormProps) {
    const { addDream, characters, locations } = useDreams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
    const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
    const [mode, setMode] = useState<InputMode>('text');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return; // Prevent empty submissions

        const newDream: Dream = {
            id: crypto.randomUUID(),
            title: title || "Untitled Dream", // Fallback title
            content,
            date: new Date().toISOString(),
            type: "normal",
            sentiment: 0.5,
            clarity: 5,
            characterIds: selectedCharacterIds,
            locationIds: selectedLocationIds,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        };
        addDream(newDream);
        onClose();
    };

    const toggleSelection = (id: string, currentList: string[], setter: (list: string[]) => void) => {
        if (currentList.includes(id)) {
            setter(currentList.filter(item => item !== id));
        } else {
            setter([...currentList, id]);
        }
    };

    const handleTranscription = useCallback((text: string) => {
        setContent(prev => prev + text);
    }, []);

    const handleGuidedComplete = useCallback((summary: string, newTags: string[]) => {
        setContent(summary);
        setTags(prev => {
            const existing = prev.split(",").map(t => t.trim()).filter(Boolean);
            const combined = Array.from(new Set([...existing, ...newTags]));
            return combined.join(", ");
        });
        setMode('text'); // Switch back to text mode to review/edit
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto py-10"
        >
            <div className="w-full max-w-3xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-4 text-mantis-gray hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-mantis-gray">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Name your dream..."
                            className="bg-transparent border-b border-white/20 py-4 text-3xl md:text-5xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'text'}
                            aria-label="Text Mode"
                            onClick={() => setMode('text')}
                            className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${mode === 'text' ? 'text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            <Type size={16} /> Text
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'voice'}
                            aria-label="Voice Mode"
                            onClick={() => setMode('voice')}
                            className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${mode === 'voice' ? 'text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            <Mic size={16} /> Voice
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'sketch'}
                            aria-label="Sketch Mode"
                            onClick={() => setMode('sketch')}
                            className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${mode === 'sketch' ? 'text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            <PenTool size={16} /> Sketch
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'guided'}
                            aria-label="Guided Mode"
                            onClick={() => setMode('guided')}
                            className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${mode === 'guided' ? 'text-mantis-green' : 'text-white/40 hover:text-mantis-green'}`}
                        >
                            <Sparkles size={16} /> Guided
                        </button>
                    </div>

                    {/* Content Input Area */}
                    <div className="min-h-[300px]">
                        {mode === 'text' && (
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Describe your dream in detail..."
                            />
                        )}
                        {mode === 'voice' && (
                            <div className="space-y-4">
                                <VoiceRecorder onTranscription={handleTranscription} />
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <h4 className="text-xs uppercase text-mantis-gray mb-2">Transcription Preview</h4>
                                    <p className="text-white/80 text-sm">{content || "No content yet..."}</p>
                                </div>
                            </div>
                        )}
                        {mode === 'sketch' && (
                            <DreamCanvas />
                        )}
                        {mode === 'guided' && (
                            <GuidedDreamWizard onComplete={handleGuidedComplete} />
                        )}
                    </div>

                    {/* Characters Selection */}
                    {characters.length > 0 && mode !== 'guided' && (
                        <div className="flex flex-col gap-4">
                            <label className="text-xs uppercase tracking-widest text-mantis-gray flex items-center gap-2">
                                <User size={14} /> Who was there?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {characters.map(char => (
                                    <button
                                        key={char.id}
                                        type="button"
                                        onClick={() => toggleSelection(char.id, selectedCharacterIds, setSelectedCharacterIds)}
                                        className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedCharacterIds.includes(char.id)
                                            ? "bg-white text-black border-white"
                                            : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {char.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Locations Selection */}
                    {locations.length > 0 && mode !== 'guided' && (
                        <div className="flex flex-col gap-4">
                            <label className="text-xs uppercase tracking-widest text-mantis-gray flex items-center gap-2">
                                <MapPin size={14} /> Where were you?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {locations.map(loc => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => toggleSelection(loc.id, selectedLocationIds, setSelectedLocationIds)}
                                        className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedLocationIds.includes(loc.id)
                                            ? "bg-white text-black border-white"
                                            : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {loc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {mode !== 'guided' && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-mantis-gray">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="flying, lucid, nightmare..."
                                className="bg-transparent border-b border-white/20 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    )}

                    {mode !== 'guided' && (
                        <button
                            type="submit"
                            className="self-end text-sm uppercase tracking-[0.2em] text-white border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Record Dream
                        </button>
                    )}
                </form>
            </div>
        </motion.div>
    );
}
