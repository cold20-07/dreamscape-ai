import { dreamService } from '../dreamService';
import { supabase } from '@/lib/supabaseClient';

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
        auth: {
            getUser: jest.fn()
        }
    }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('dreamService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDreams', () => {
        it('should fetch and transform dreams correctly', async () => {
            const mockDreams = [
                {
                    id: '1',
                    title: 'Test Dream',
                    content: 'Dream content',
                    date: '2024-01-01T00:00:00Z',
                    type: 'normal',
                    sentiment: 0.5,
                    clarity: 5,
                    tags: ['flying'],
                    dream_characters: [{ character_id: 'char-1' }],
                    dream_locations: [{ location_id: 'loc-1' }]
                }
            ];

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    order: jest.fn().mockResolvedValue({ data: mockDreams, error: null })
                })
            });

            const dreams = await dreamService.getDreams();

            expect(dreams).toHaveLength(1);
            expect(dreams[0].title).toBe('Test Dream');
            expect(dreams[0].characterIds).toEqual(['char-1']);
            expect(dreams[0].locationIds).toEqual(['loc-1']);
        });

        it('should throw error when fetch fails', async () => {
            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    order: jest.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') })
                })
            });

            await expect(dreamService.getDreams()).rejects.toThrow('Fetch failed');
        });
    });

    describe('getStats', () => {
        it('should return empty stats when no dreams exist', async () => {
            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    order: jest.fn().mockResolvedValue({ data: [], error: null })
                })
            });

            const stats = await dreamService.getStats();

            expect(stats.totalDreams).toBe(0);
            expect(stats.streak).toBe(0);
            expect(stats.lastRecorded).toBeNull();
        });

        it('should calculate stats correctly', async () => {
            const mockDreams = [
                { date: new Date().toISOString(), clarity: 8, sentiment: 0.8 },
                { date: new Date().toISOString(), clarity: 6, sentiment: 0.6 }
            ];

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    order: jest.fn().mockResolvedValue({ data: mockDreams, error: null })
                })
            });

            const stats = await dreamService.getStats();

            expect(stats.totalDreams).toBe(2);
            expect(stats.averageClarity).toBe(7);
            expect(stats.averageSentiment).toBe(0.7);
        });
    });
});
