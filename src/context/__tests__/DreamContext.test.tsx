import { render, screen, waitFor, act } from '@testing-library/react';
import { DreamProvider, useDreams } from '../DreamContext';
import { dreamService } from '@/services/dreamService';

// Mock dreamService
jest.mock('@/services/dreamService', () => ({
    dreamService: {
        seed: jest.fn(),
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
    });

    it('loads initial data correctly', async () => {
        (dreamService.getDreams as jest.Mock).mockReturnValue([{ id: '1', title: 'Test Dream' }]);
        (dreamService.getCharacters as jest.Mock).mockReturnValue([]);
        (dreamService.getLocations as jest.Mock).mockReturnValue([]);
        (dreamService.getStats as jest.Mock).mockReturnValue(null);

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
        (dreamService.seed as jest.Mock).mockImplementation(() => {
            throw new Error('Storage full');
        });

        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        render(
            <DreamProvider>
                <TestComponent />
            </DreamProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load your dreams');
        });

        console.error = originalError;
    });

    it('adds a dream successfully', async () => {
        (dreamService.getDreams as jest.Mock).mockReturnValue([]);
        (dreamService.getCharacters as jest.Mock).mockReturnValue([]);
        (dreamService.getLocations as jest.Mock).mockReturnValue([]);
        (dreamService.getStats as jest.Mock).mockReturnValue(null);

        render(
            <DreamProvider>
                <TestComponent />
            </DreamProvider>
        );

        const addButton = screen.getByText('Add Dream');

        // Update mock for subsequent calls
        (dreamService.getDreams as jest.Mock).mockReturnValue([{ id: '1', title: 'New Dream' }]);

        act(() => {
            addButton.click();
        });

        await waitFor(() => {
            expect(dreamService.saveDream).toHaveBeenCalled();
            expect(screen.getByTestId('dream-count')).toHaveTextContent('1');
        });
    });
});
