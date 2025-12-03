import { render, screen, waitFor, act } from '@testing-library/react';
import { DreamProvider, useDreams } from '../DreamContext';
import { dreamService } from '@/services/dreamService';

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: jest.fn().mockReturnValue({
                data: { subscription: { unsubscribe: jest.fn() } }
            }),
            getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        },
        from: jest.fn(),
    }
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        user: { id: 'test-user', email: 'test@example.com' },
        session: { access_token: 'test-token' },
        isLoading: false,
        signOut: jest.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock dreamService
jest.mock('@/services/dreamService', () => ({
    dreamService: {
        getDreams: jest.fn(),
        getCharacters: jest.fn(),
        getLocations: jest.fn(),
        getStats: jest.fn(),
        saveDream: jest.fn(),
        deleteDream: jest.fn(),
        saveCharacter: jest.fn(),
        deleteCharacter: jest.fn(),
        saveLocation: jest.fn(),
        deleteLocation: jest.fn(),
    },
}));

// Test component to consume context
const TestComponent = () => {
    const { dreams, error, addDream } = useDreams();
    return (
        <div>
            <div data-testid="dream-count">{dreams.length}</div>
            {error && <div data-testid="error-message">{error}</div>}
            <button onClick={() => addDream({ id: '1', title: 'New Dream', content: '', date: '', type: 'normal', sentiment: 0, clarity: 0, characterIds: [], locationIds: [], tags: [] })}>
                Add Dream
            </button>
        </div>
    );
};

describe('DreamContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock returns
        (dreamService.getDreams as jest.Mock).mockResolvedValue([]);
        (dreamService.getCharacters as jest.Mock).mockResolvedValue([]);
        (dreamService.getLocations as jest.Mock).mockResolvedValue([]);
        (dreamService.getStats as jest.Mock).mockResolvedValue(null);
    });

    it('loads initial data correctly', async () => {
        (dreamService.getDreams as jest.Mock).mockResolvedValue([{ id: '1', title: 'Test Dream' }]);

        render(
            <DreamProvider>
                <TestComponent />
            </DreamProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('dream-count')).toHaveTextContent('1');
        });
    });

    it('handles data loading errors', async () => {
        (dreamService.getDreams as jest.Mock).mockRejectedValue(new Error('Network error'));

        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        render(
            <DreamProvider>
                <TestComponent />
            </DreamProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load data.');
        });

        console.error = originalError;
    });

    it('adds a dream successfully', async () => {
        (dreamService.saveDream as jest.Mock).mockResolvedValue({ id: '1', title: 'New Dream' });

        render(
            <DreamProvider>
                <TestComponent />
            </DreamProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('dream-count')).toHaveTextContent('0');
        });

        const addButton = screen.getByText('Add Dream');

        // Update mock for subsequent calls after save
        (dreamService.getDreams as jest.Mock).mockResolvedValue([{ id: '1', title: 'New Dream' }]);

        await act(async () => {
            addButton.click();
        });

        await waitFor(() => {
            expect(dreamService.saveDream).toHaveBeenCalled();
            expect(screen.getByTestId('dream-count')).toHaveTextContent('1');
        });
    });
});
