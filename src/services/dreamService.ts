import { Dream, Character, Location, DreamStats, DreamType } from "@/types";
import { supabase } from "@/lib/supabaseClient";

// Database row types
interface DreamRow {
    id: string;
    title: string;
    content: string;
    date: string;
    type: DreamType;
    sentiment: number;
    clarity: number;
    tags: string[] | null;
    dream_characters?: { character_id: string }[];
    dream_locations?: { location_id: string }[];
}

interface CharacterRow {
    id: string;
    name: string;
    relationship: string;
    description: string;
    appearances: number;
    first_appearance: string;
    dream_characters?: { dream_id: string }[];
}

interface LocationRow {
    id: string;
    name: string;
    description: string;
    appearances: number;
    dream_locations?: { dream_id: string }[];
}

interface DreamStatsRow {
    date: string;
    clarity: number;
    sentiment: number;
}

export const dreamService = {
    // Dreams
    getDreams: async (): Promise<Dream[]> => {
        const { data, error } = await supabase
            .from('dreams')
            .select(`
                *,
                dream_characters (character_id),
                dream_locations (location_id)
            `)
            .order('date', { ascending: false });

        if (error) throw error;

        return (data || []).map((d: DreamRow) => ({
            id: d.id,
            title: d.title,
            content: d.content,
            date: d.date,
            type: d.type,
            sentiment: d.sentiment,
            clarity: d.clarity,
            tags: d.tags || [],
            characterIds: d.dream_characters?.map((dc) => dc.character_id) || [],
            locationIds: d.dream_locations?.map((dl) => dl.location_id) || [],
            relatedDreamIds: [], // TODO: Implement related dreams storage or calculation
        }));
    },

    saveDream: async (dream: Dream): Promise<Dream> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // 1. Upsert Dream
        const dreamToSave = {
            id: dream.id,
            user_id: user.id,
            title: dream.title,
            content: dream.content,
            date: dream.date,
            type: dream.type,
            sentiment: dream.sentiment,
            clarity: dream.clarity,
            tags: dream.tags,
        };

        const { data: savedDream, error: dreamError } = await supabase
            .from('dreams')
            .upsert(dreamToSave)
            .select()
            .single();

        if (dreamError) throw dreamError;

        // 2. Update Relations
        // Characters
        if (dream.characterIds) {
            // Delete existing
            await supabase.from('dream_characters').delete().eq('dream_id', savedDream.id);
            // Insert new
            if (dream.characterIds.length > 0) {
                const charRelations = dream.characterIds.map(cid => ({
                    dream_id: savedDream.id,
                    character_id: cid
                }));
                const { error: charError } = await supabase.from('dream_characters').insert(charRelations);
                if (charError) console.error("Error saving character relations:", charError);
            }
        }

        // Locations
        if (dream.locationIds) {
            // Delete existing
            await supabase.from('dream_locations').delete().eq('dream_id', savedDream.id);
            // Insert new
            if (dream.locationIds.length > 0) {
                const locRelations = dream.locationIds.map(lid => ({
                    dream_id: savedDream.id,
                    location_id: lid
                }));
                const { error: locError } = await supabase.from('dream_locations').insert(locRelations);
                if (locError) console.error("Error saving location relations:", locError);
            }
        }

        return {
            ...savedDream,
            characterIds: dream.characterIds || [],
            locationIds: dream.locationIds || [],
            relatedDreamIds: []
        };
    },

    deleteDream: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('dreams')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Characters
    getCharacters: async (): Promise<Character[]> => {
        const { data, error } = await supabase
            .from('characters')
            .select(`
                *,
                dream_characters (dream_id)
            `);

        if (error) throw error;

        return (data || []).map((c: CharacterRow) => ({
            id: c.id,
            name: c.name,
            relationship: c.relationship,
            description: c.description,
            appearances: c.appearances,
            firstAppearance: c.first_appearance,
            dreamIds: c.dream_characters?.map((dc) => dc.dream_id) || []
        }));
    },

    saveCharacter: async (character: Character): Promise<Character> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const charToSave = {
            id: character.id,
            user_id: user.id,
            name: character.name,
            relationship: character.relationship,
            description: character.description,
            appearances: character.appearances,
            first_appearance: character.firstAppearance,
        };

        const { data, error } = await supabase
            .from('characters')
            .upsert(charToSave)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            relationship: data.relationship,
            description: data.description,
            appearances: data.appearances,
            firstAppearance: data.first_appearance,
            dreamIds: character.dreamIds || [] // We don't update dreamIds from here usually, they come from dreams
        };
    },

    deleteCharacter: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('characters')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Locations
    getLocations: async (): Promise<Location[]> => {
        const { data, error } = await supabase
            .from('locations')
            .select(`
                *,
                dream_locations (dream_id)
            `);

        if (error) throw error;

        return (data || []).map((l: LocationRow) => ({
            id: l.id,
            name: l.name,
            description: l.description,
            appearances: l.appearances,
            dreamIds: l.dream_locations?.map((dl) => dl.dream_id) || []
        }));
    },

    saveLocation: async (location: Location): Promise<Location> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const locToSave = {
            id: location.id,
            user_id: user.id,
            name: location.name,
            description: location.description,
            appearances: location.appearances,
        };

        const { data, error } = await supabase
            .from('locations')
            .upsert(locToSave)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            appearances: data.appearances,
            dreamIds: location.dreamIds || []
        };
    },

    deleteLocation: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('locations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Stats
    getStats: async (): Promise<DreamStats> => {
        const { data: dreams, error } = await supabase
            .from('dreams')
            .select('date, clarity, sentiment')
            .order('date', { ascending: false });

        if (error) throw error;

        if (!dreams || dreams.length === 0) {
            return {
                totalDreams: 0,
                streak: 0,
                lastRecorded: null,
                averageClarity: 0,
                averageSentiment: 0,
            };
        }

        const totalDreams = dreams.length;

        // Calculate streak
        let streak = 0;
        if (dreams.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const currentDate = today;
            const lastDreamDate = new Date(dreams[0].date);
            lastDreamDate.setHours(0, 0, 0, 0);

            const diffDays = (currentDate.getTime() - lastDreamDate.getTime()) / (1000 * 3600 * 24);

            if (diffDays <= 1) {
                streak = 1;
                let checkDate = lastDreamDate;

                for (let i = 1; i < dreams.length; i++) {
                    const prevDreamDate = new Date(dreams[i].date);
                    prevDreamDate.setHours(0, 0, 0, 0);
                    const gap = (checkDate.getTime() - prevDreamDate.getTime()) / (1000 * 3600 * 24);

                    if (gap === 1) {
                        streak++;
                        checkDate = prevDreamDate;
                    } else if (gap === 0) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        }

        const avgClarity = dreams.reduce((acc: number, d: DreamStatsRow) => acc + d.clarity, 0) / totalDreams;
        const avgSentiment = dreams.reduce((acc: number, d: DreamStatsRow) => acc + d.sentiment, 0) / totalDreams;

        return {
            totalDreams,
            streak,
            lastRecorded: dreams[0]?.date || null,
            averageClarity: Number(avgClarity.toFixed(1)),
            averageSentiment: Number(avgSentiment.toFixed(2)),
        };
    },

    // Data Management
    clearAll: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Delete all data for user
        await supabase.from('dreams').delete().eq('user_id', user.id);
        await supabase.from('characters').delete().eq('user_id', user.id);
        await supabase.from('locations').delete().eq('user_id', user.id);
    },

    exportData: async () => {
        const dreams = await dreamService.getDreams();
        const characters = await dreamService.getCharacters();
        const locations = await dreamService.getLocations();
        return JSON.stringify({ dreams, characters, locations }, null, 2);
    }
};
