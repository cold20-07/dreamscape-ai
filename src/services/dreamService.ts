import { Dream, Character, Location, DreamStats } from "@/types";

const STORAGE_KEYS = {
    DREAMS: "dreamscape_dreams",
    CHARACTERS: "dreamscape_characters",
    LOCATIONS: "dreamscape_locations",
};

export const dreamService = {
    // Dreams
    getDreams: (): Dream[] => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem(STORAGE_KEYS.DREAMS);
        return stored ? JSON.parse(stored) : [];
    },

    saveDream: (dream: Dream): void => {
        if (typeof window === "undefined") return;
        const dreams = dreamService.getDreams();

        // 1. Calculate related dreams for the new/updated dream
        const relatedIds = dreamService.findRelatedDreams(dream, dreams);
        dream.relatedDreamIds = relatedIds;

        const existingIndex = dreams.findIndex(d => d.id === dream.id);
        let newDreams;

        if (existingIndex >= 0) {
            newDreams = [...dreams];
            newDreams[existingIndex] = dream;
        } else {
            newDreams = [dream, ...dreams];
        }

        // 2. Bidirectional linking: Update related dreams to point back to this one
        relatedIds.forEach(relatedId => {
            const relatedDream = newDreams.find(d => d.id === relatedId);
            if (relatedDream) {
                const currentRelated = relatedDream.relatedDreamIds || [];
                if (!currentRelated.includes(dream.id)) {
                    relatedDream.relatedDreamIds = [...currentRelated, dream.id];
                }
            }
        });

        window.localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(newDreams));
    },

    findRelatedDreams: (dream: Dream, allDreams: Dream[]): string[] => {
        return allDreams
            .filter(d => d.id !== dream.id)
            .map(d => {
                let score = 0;
                const sharedTags = d.tags.filter(t => dream.tags.includes(t)).length;
                const sharedChars = d.characterIds.filter(c => dream.characterIds.includes(c)).length;
                const sharedLocs = d.locationIds.filter(l => dream.locationIds.includes(l)).length;
                score = sharedTags + (sharedChars * 2) + (sharedLocs * 2);
                return { id: d.id, score };
            })
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(d => d.id);
    },

    deleteDream: (id: string): void => {
        if (typeof window === "undefined") return;
        const dreams = dreamService.getDreams();
        const newDreams = dreams.filter((d) => d.id !== id);
        window.localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(newDreams));
    },

    // Characters
    getCharacters: (): Character[] => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem(STORAGE_KEYS.CHARACTERS);
        return stored ? JSON.parse(stored) : [];
    },

    saveCharacter: (character: Character): void => {
        if (typeof window === "undefined") return;
        const items = dreamService.getCharacters();
        const existingIndex = items.findIndex(c => c.id === character.id);

        let newItems;
        if (existingIndex >= 0) {
            newItems = [...items];
            newItems[existingIndex] = character;
        } else {
            newItems = [character, ...items];
        }

        window.localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(newItems));
    },

    deleteCharacter: (id: string): void => {
        if (typeof window === "undefined") return;
        const items = dreamService.getCharacters();
        const newItems = items.filter((c) => c.id !== id);
        window.localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(newItems));
    },

    // Locations
    getLocations: (): Location[] => {
        if (typeof window === "undefined") return [];
        const stored = window.localStorage.getItem(STORAGE_KEYS.LOCATIONS);
        return stored ? JSON.parse(stored) : [];
    },

    saveLocation: (location: Location): void => {
        if (typeof window === "undefined") return;
        const items = dreamService.getLocations();
        const existingIndex = items.findIndex(l => l.id === location.id);

        let newItems;
        if (existingIndex >= 0) {
            newItems = [...items];
            newItems[existingIndex] = location;
        } else {
            newItems = [location, ...items];
        }

        window.localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(newItems));
    },

    deleteLocation: (id: string): void => {
        if (typeof window === "undefined") return;
        const items = dreamService.getLocations();
        const newItems = items.filter((l) => l.id !== id);
        window.localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(newItems));
    },

    // Stats
    getStats: (): DreamStats => {
        const dreams = dreamService.getDreams();
        const totalDreams = dreams.length;

        if (totalDreams === 0) {
            return {
                totalDreams: 0,
                streak: 0,
                lastRecorded: null,
                averageClarity: 0,
                averageSentiment: 0,
            };
        }

        // Calculate streak
        let streak = 0;
        const sortedDreams = [...dreams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (sortedDreams.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const currentDate = today;
            const lastDreamDate = new Date(sortedDreams[0].date);
            lastDreamDate.setHours(0, 0, 0, 0);

            // If the last dream was today or yesterday, the streak is alive
            const diffDays = (currentDate.getTime() - lastDreamDate.getTime()) / (1000 * 3600 * 24);

            if (diffDays <= 1) {
                streak = 1;
                let checkDate = lastDreamDate;

                // Check previous dreams for consecutive days
                for (let i = 1; i < sortedDreams.length; i++) {
                    const prevDreamDate = new Date(sortedDreams[i].date);
                    prevDreamDate.setHours(0, 0, 0, 0);

                    const gap = (checkDate.getTime() - prevDreamDate.getTime()) / (1000 * 3600 * 24);

                    if (gap === 1) {
                        streak++;
                        checkDate = prevDreamDate;
                    } else if (gap === 0) {
                        // Same day, continue checking
                        continue;
                    } else {
                        // Streak broken
                        break;
                    }
                }
            }
        }

        const avgClarity = dreams.reduce((acc, d) => acc + d.clarity, 0) / totalDreams;
        const avgSentiment = dreams.reduce((acc, d) => acc + d.sentiment, 0) / totalDreams;

        return {
            totalDreams,
            streak,
            lastRecorded: sortedDreams[0]?.date || null,
            averageClarity: Number(avgClarity.toFixed(1)),
            averageSentiment: Number(avgSentiment.toFixed(2)),
        };
    },

    // Seed
    seed: () => {
        if (typeof window === "undefined") return;

        // Check if we've already seeded or if the user has explicitly cleared data
        // We'll use a separate flag for "hasSeeded" to avoid re-seeding after clearing
        const hasSeeded = window.localStorage.getItem("dreamscape_has_seeded");

        if (!hasSeeded && dreamService.getDreams().length === 0) {
            const initialDreams: Dream[] = [
                {
                    id: "1",
                    title: "Neon City Flight",
                    content: "I was soaring above a metropolis of glowing neon structures. The wind felt electric.",
                    date: new Date().toISOString(),
                    type: "lucid",
                    sentiment: 0.8,
                    clarity: 9,
                    characterIds: ["c1"],
                    locationIds: ["l1"],
                    tags: ["flying", "neon", "city"],
                },
                {
                    id: "2",
                    title: "The Endless Library",
                    content: "Walking through infinite corridors of books. Each book contained a different universe.",
                    date: new Date(Date.now() - 86400000).toISOString(),
                    type: "normal",
                    sentiment: 0.5,
                    clarity: 7,
                    characterIds: ["c2"],
                    locationIds: ["l2"],
                    tags: ["library", "books", "infinity"],
                }
            ];

            const initialCharacters: Character[] = [
                {
                    id: "c1",
                    name: "The Guide",
                    relationship: "Mentor",
                    description: "A glowing figure that shows me the way.",
                    dreamIds: ["1"],
                    appearances: 1,
                    firstAppearance: new Date().toISOString(),
                },
                {
                    id: "c2",
                    name: "The Librarian",
                    relationship: "Stranger",
                    description: "An old man with glasses who guards the books.",
                    dreamIds: ["2"],
                    appearances: 1,
                    firstAppearance: new Date(Date.now() - 86400000).toISOString(),
                }
            ];

            const initialLocations: Location[] = [
                {
                    id: "l1",
                    name: "Neon Metropolis",
                    description: "A futuristic city with glowing lights.",
                    dreamIds: ["1"],
                    appearances: 1,
                },
                {
                    id: "l2",
                    name: "Infinite Library",
                    description: "A library with no end.",
                    dreamIds: ["2"],
                    appearances: 1,
                }
            ];

            window.localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(initialDreams));
            window.localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(initialCharacters));
            window.localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(initialLocations));
            window.localStorage.setItem("dreamscape_has_seeded", "true");
        }
    },

    // Data Management
    clearAll: () => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(STORAGE_KEYS.DREAMS);
        window.localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
        window.localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    },

    exportData: () => {
        const dreams = dreamService.getDreams();
        const characters = dreamService.getCharacters();
        const locations = dreamService.getLocations();
        return JSON.stringify({ dreams, characters, locations }, null, 2);
    }
};
