"use client";

import { useCallback } from "react";

export function useSound(url: string) {
    const play = useCallback(() => {
        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn("Audio play failed", e));
        } catch (e) {
            console.warn("Audio initialization failed", e);
        }
    }, [url]);

    return play;
}
