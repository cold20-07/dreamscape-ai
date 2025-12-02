"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Dream, Location, Character, DreamStats } from "@/types";
import { dreamService } from "@/services/dreamService";

interface DreamContextType {
    dreams: Dream[];
    characters: Character[];
    locations: Location[];
    stats: DreamStats | null;
    isLoading: boolean;
    error: string | null;
    addDream: (dream: Dream) => void;
    deleteDream: (id: string) => void;
    addCharacter: (character: Character) => void;
    deleteCharacter: (id: string) => void;
    addLocation: (location: Location) => void;
    deleteLocation: (id: string) => void;
    refreshData: () => void;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export function DreamProvider({ children }: { children: React.ReactNode }) {
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [stats, setStats] = useState<DreamStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Seed data if needed (only runs on client)
        if (typeof window !== "undefined") {
            try {
                dreamService.seed();
                const dreams = dreamService.getDreams();
                const characters = dreamService.getCharacters();
                const locations = dreamService.getLocations();
                const stats = dreamService.getStats();

                setDreams(dreams);
                setCharacters(characters);
                setLocations(locations);
                setStats(stats);
            } catch (err) {
                console.error("Failed to load dream data:", err);
                setError("Failed to load your dreams. Local storage might be corrupted.");
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    const refreshData = useCallback(() => {
        try {
            setDreams(dreamService.getDreams());
            setCharacters(dreamService.getCharacters());
            setLocations(dreamService.getLocations());
            setStats(dreamService.getStats());
            setError(null);
        } catch (err) {
            console.error("Failed to refresh data:", err);
            setError("Failed to refresh data.");
        }
    }, []);

    const addDream = (dream: Dream) => {
        try {
            dreamService.saveDream(dream);
            refreshData();
        } catch (err) {
            console.error("Failed to save dream:", err);
            setError("Failed to save dream.");
        }
    };

    const deleteDream = (id: string) => {
        try {
            dreamService.deleteDream(id);
            refreshData();
        } catch (err) {
            console.error("Failed to delete dream:", err);
            setError("Failed to delete dream.");
        }
    };

    const addCharacter = (character: Character) => {
        try {
            dreamService.saveCharacter(character);
            refreshData();
        } catch (err) {
            console.error("Failed to save character:", err);
            setError("Failed to save character.");
        }
    };

    const deleteCharacter = (id: string) => {
        try {
            dreamService.deleteCharacter(id);
            refreshData();
        } catch (err) {
            console.error("Failed to delete character:", err);
            setError("Failed to delete character.");
        }
    };

    const addLocation = (location: Location) => {
        try {
            dreamService.saveLocation(location);
            refreshData();
        } catch (err) {
            console.error("Failed to save location:", err);
            setError("Failed to save location.");
        }
    };

    const deleteLocation = (id: string) => {
        try {
            dreamService.deleteLocation(id);
            refreshData();
        } catch (err) {
            console.error("Failed to delete location:", err);
            setError("Failed to delete location.");
        }
    };

    return (
        <DreamContext.Provider value={{
            dreams,
            characters,
            locations,
            stats,
            isLoading,
            error,
            addDream,
            deleteDream,
            addCharacter,
            deleteCharacter,
            addLocation,
            deleteLocation,
            refreshData
        }}>
            {children}
        </DreamContext.Provider>
    );
}

export function useDreams() {
    const context = useContext(DreamContext);
    if (context === undefined) {
        throw new Error("useDreams must be used within a DreamProvider");
    }
    return context;
}
