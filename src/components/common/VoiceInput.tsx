"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
    onResult: (text: string) => void;
    isListening?: boolean;
    onToggle?: (listening: boolean) => void;
    className?: string;
}

export function VoiceInput({ onResult, onToggle, className = "" }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [error, setError] = useState<string | null>(null);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            onToggle?.(false);
        }
    }, [onToggle]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = true;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = "en-US";

                recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                    let finalTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        }
                    }
                    if (finalTranscript) {
                        onResult(finalTranscript);
                    }
                };

                recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error", event.error);
                    setError("Error accessing microphone");
                    if (recognitionRef.current) {
                        recognitionRef.current.stop();
                        setIsListening(false);
                        onToggle?.(false);
                    }
                };

                recognitionInstance.onend = () => {
                    if (isListening) {
                        setIsListening(false);
                        onToggle?.(false);
                    }
                };

                recognitionRef.current = recognitionInstance;
            } else {
                setError("Browser not supported");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onResult, isListening, onToggle]);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                onToggle?.(true);
                setError(null);
            } catch (e) {
                console.error(e);
            }
        }
    }, [onToggle]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (error === "Browser not supported") return null;

    return (
        <button
            onClick={toggleListening}
            className={`p-2 rounded-full transition-all duration-300 ${isListening
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse"
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                } ${className}`}
            title={isListening ? "Stop recording" : "Start recording"}
        >
            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
    );
}
