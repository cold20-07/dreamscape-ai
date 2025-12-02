import { render, screen, fireEvent } from '@testing-library/react';
import { DreamList } from '../DreamList';
import { Dream } from '@/types';

// Mock context
const mockDeleteDream = jest.fn();
const mockDreams: Dream[] = [
    {
        id: '1',
        title: 'Test Dream 1',
        content: 'Content 1',
        date: new Date().toISOString(),
        type: 'lucid',
        sentiment: 0.8,
        clarity: 8,
        characterIds: [],
        locationIds: [],
        tags: ['flying']
    },
    {
        id: '2',
        title: 'Test Dream 2',
        content: 'Content 2',
        date: new Date().toISOString(),
        type: 'nightmare',
        sentiment: 0.2,
        clarity: 3,
        characterIds: [],
        locationIds: [],
        tags: []
    }
];

jest.mock('@/context/DreamContext', () => ({
    useDreams: () => ({
        dreams: mockDreams,
        deleteDream: mockDeleteDream,
    }),
}));

describe('DreamList', () => {
    it('renders list of dreams', () => {
        render(<DreamList />);
        expect(screen.getByText('Test Dream 1')).toBeInTheDocument();
        expect(screen.getByText('Test Dream 2')).toBeInTheDocument();
        expect(screen.getByText('#flying')).toBeInTheDocument();
    });

    it('calls deleteDream when delete button is clicked', () => {
        render(<DreamList />);
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
        expect(mockDeleteDream).toHaveBeenCalledWith('1');
    });
});
