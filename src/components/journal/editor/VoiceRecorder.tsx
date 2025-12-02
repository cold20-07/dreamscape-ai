"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

interface VoiceRecorderProps {
    onTranscription: (text: string) => void;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
}

export function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;

            speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + " " + finalTranscript);
                    onTranscription(finalTranscript);
                }
            };

            recognitionRef.current = speechRecognition;
        }
    }, [onTranscription]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsRecording(true);
            } else {
                // Fallback for browsers without speech API (Mock)
                setIsRecording(true);
                const mockText = " This is a simulated transcription because your browser doesn't support the Web Speech API.";
                setTimeout(() => {
                    setTranscript(prev => prev + mockText);
                    onTranscription(mockText);
                    setIsRecording(false);
                }, 3000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8 py-12 bg-white/5 rounded-2xl border border-white/10">
            <div className="relative">
                {isRecording && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-red-500 rounded-full"
                    />
                )}
                <button
                    onClick={toggleRecording}
                    className={`relative z-10 p-6 rounded-full transition-all duration-300 ${isRecording ? "bg-red-500 text-white" : "bg-white text-black hover:scale-105"
                        }`}
                >
                    {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
                </button>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">
                    {isRecording ? "Listening..." : "Tap to Record"}
                </h3>
                <p className="text-sm text-mantis-gray max-w-xs mx-auto">
                    {isRecording
                        ? "Speak clearly. We're transcribing your dream in real-time."
                        : "Use your voice to capture the details before they fade."}
                </p>
            </div>

            {transcript && (
                <div className="w-full max-w-md px-6">
                    <p className="text-sm text-white/60 italic border-l-2 border-white/20 pl-4">
                        &quot;{transcript}&quot;
                    </p>
                </div>
            )}
        </div>
    );
}
