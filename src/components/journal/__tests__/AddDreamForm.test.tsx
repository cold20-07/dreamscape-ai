import { render, screen, fireEvent } from '@testing-library/react';
import { AddDreamForm } from '../AddDreamForm';

// Mock sub-components
jest.mock('../editor/RichTextEditor', () => ({
    RichTextEditor: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <textarea
            data-testid="rich-text-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

jest.mock('../editor/VoiceRecorder', () => ({
    VoiceRecorder: () => <div data-testid="voice-recorder" />,
}));

jest.mock('../editor/DreamCanvas', () => ({
    DreamCanvas: () => <div data-testid="dream-canvas" />,
}));

jest.mock('../editor/GuidedDreamWizard', () => ({
    GuidedDreamWizard: () => <div data-testid="guided-wizard" />,
}));

// Mock context
const mockAddDream = jest.fn();
jest.mock('@/context/DreamContext', () => ({
    useDreams: () => ({
        addDream: mockAddDream,
        characters: [],
        locations: [],
    }),
}));

describe('AddDreamForm', () => {
    beforeEach(() => {
        mockAddDream.mockClear();
    });

    it('renders correctly', () => {
        render(<AddDreamForm onClose={() => { }} />);
        expect(screen.getByPlaceholderText('Name your dream...')).toBeInTheDocument();
    });

    it('prevents empty submission', () => {
        const onClose = jest.fn();
        render(<AddDreamForm onClose={onClose} />);

        const submitButton = screen.getByText('Record Dream');
        fireEvent.click(submitButton);

        expect(mockAddDream).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('submits with content', () => {
        const onClose = jest.fn();
        render(<AddDreamForm onClose={onClose} />);

        const titleInput = screen.getByPlaceholderText('Name your dream...');
        fireEvent.change(titleInput, { target: { value: 'My Dream' } });

        const contentInput = screen.getByTestId('rich-text-editor');
        fireEvent.change(contentInput, { target: { value: 'Dream content' } });

        const submitButton = screen.getByText('Record Dream');
        fireEvent.click(submitButton);

        expect(mockAddDream).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('has accessibility labels', () => {
        render(<AddDreamForm onClose={() => { }} />);
        expect(screen.getByLabelText('Close')).toBeInTheDocument();
        expect(screen.getByLabelText('Text Mode')).toBeInTheDocument();
    });
});
