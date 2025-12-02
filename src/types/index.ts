export type DreamType = 'lucid' | 'nightmare' | 'recurring' | 'normal';

export interface Dream {
    id: string;
    title: string;
    content: string;
    date: string; // ISO date string
    type: DreamType;
    sentiment: number; // 0 to 1 (0 = negative, 1 = positive)
    clarity: number; // 0 to 10
    locationIds: string[];
    characterIds: string[];
    tags: string[];
    relatedDreamIds?: string[]; // IDs of auto-linked dreams
    embedding?: number[]; // For future vector search
}

export interface Location {
    id: string;
    name: string;
    description: string;
    coordinates?: [number, number, number]; // 3D coordinates in the dream universe
    dreamIds: string[];
    imageUrl?: string; // Generated image of the location
    appearances: number;
}

export interface Character {
    id: string;
    name: string;
    relationship: string;
    description?: string;
    dreamIds: string[];
    avatarUrl?: string;
    appearances: number;
    firstAppearance: string; // ISO date
}

export interface Thread {
    id: string;
    name: string;
    type: 'character' | 'location' | 'symbol' | 'emotion';
    description: string;
    relatedDreamIds: string[];
    strength: number; // How strong is this thread?
}

export interface DreamStats {
    totalDreams: number;
    streak: number;
    lastRecorded: string | null;
    averageClarity: number;
    averageSentiment: number;
}

export interface Soundscape {
    id: string;
    name: string;
    description: string;
    url: string;
    type: 'ambient' | 'binaural' | 'guided';
}
