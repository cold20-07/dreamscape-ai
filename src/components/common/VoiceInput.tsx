"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
    onResult: (text: string) => void;
    isListening?: boolean;
    onToggle?: (listening: boolean) => void;
    className?: string;
}

// Check browser support outside component to avoid setState in effect
const isBrowserSupported = typeof window !== "undefined" && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

export function VoiceInput({ onResult, onToggle, className = "" }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(!isBrowserSupported ? "Browser not supported" : null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const onResultRef = useRef(onResult);
    const onToggleRef = useRef(onToggle);

    // Keep refs updated
    useEffect(() => {
        onResultRef.current = onResult;
        onToggleRef.current = onToggle;
    }, [onResult, onToggle]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            onToggleRef.current?.(false);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !isBrowserSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
                onResultRef.current(finalTranscript);
            }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error", event.error);
            setError("Error accessing microphone");
            recognitionInstance.stop();
            setIsListening(false);
            onToggleRef.current?.(false);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
            onToggleRef.current?.(false);
        };

        recognitionRef.current = recognitionInstance;

        return () => {
            recognitionInstance.stop();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                onToggleRef.current?.(true);
                setError(null);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

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
