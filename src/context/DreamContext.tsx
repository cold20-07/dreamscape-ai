"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Dream, Location, Character, DreamStats } from "@/types";
import { dreamService } from "@/services/dreamService";
import { useAuth } from "@/context/AuthContext";

interface DreamContextType {
    dreams: Dream[];
    characters: Character[];
    locations: Location[];
    stats: DreamStats | null;
    isLoading: boolean;
    error: string | null;
    addDream: (dream: Dream) => Promise<void>;
    deleteDream: (id: string) => Promise<void>;
    addCharacter: (character: Character) => Promise<void>;
    deleteCharacter: (id: string) => Promise<void>;
    addLocation: (location: Location) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export function DreamProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [stats, setStats] = useState<DreamStats | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Start false, load when user exists
    const [error, setError] = useState<string | null>(null);

    const refreshData = useCallback(async () => {
        if (!user) {
            setDreams([]);
            setCharacters([]);
            setLocations([]);
            setStats(null);
            return;
        }

        setIsLoading(true);
        try {
            const [fetchedDreams, fetchedCharacters, fetchedLocations, fetchedStats] = await Promise.all([
                dreamService.getDreams(),
                dreamService.getCharacters(),
                dreamService.getLocations(),
                dreamService.getStats()
            ]);

            setDreams(fetchedDreams);
            setCharacters(fetchedCharacters);
            setLocations(fetchedLocations);
            setStats(fetchedStats);
            setError(null);
        } catch (err) {
            console.error("Failed to refresh data:", err);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addDream = async (dream: Dream) => {
        try {
            await dreamService.saveDream(dream);
            await refreshData();
        } catch (err) {
            console.error("Failed to save dream:", err);
            setError("Failed to save dream.");
            throw err;
        }
    };

    const deleteDream = async (id: string) => {
        try {
            await dreamService.deleteDream(id);
            await refreshData();
        } catch (err) {
            console.error("Failed to delete dream:", err);
            setError("Failed to delete dream.");
            throw err;
        }
    };

    const addCharacter = async (character: Character) => {
        try {
            await dreamService.saveCharacter(character);
            await refreshData();
        } catch (err) {
            console.error("Failed to save character:", err);
            setError("Failed to save character.");
            throw err;
        }
    };

    const deleteCharacter = async (id: string) => {
        try {
            await dreamService.deleteCharacter(id);
            await refreshData();
        } catch (err) {
            console.error("Failed to delete character:", err);
            setError("Failed to delete character.");
            throw err;
        }
    };

    const addLocation = async (location: Location) => {
        try {
            await dreamService.saveLocation(location);
            await refreshData();
        } catch (err) {
            console.error("Failed to save location:", err);
            setError("Failed to save location.");
            throw err;
        }
    };

    const deleteLocation = async (id: string) => {
        try {
            await dreamService.deleteLocation(id);
            await refreshData();
        } catch (err) {
            console.error("Failed to delete location:", err);
            setError("Failed to delete location.");
            throw err;
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
