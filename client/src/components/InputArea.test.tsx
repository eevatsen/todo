import { render, screen, fireEvent, waitFor } from '../test-utils';
import InputArea from './InputArea';

describe('InputArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button', () => {
    render(<InputArea />);
    expect(screen.getByPlaceholderText(/Add a new task.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(<InputArea />);
    const input = screen.getByPlaceholderText(/Add a new task.../i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Buy groceries' } });
    expect(input.value).toBe('Buy groceries');
  });

  test('shows error when adding empty title', async () => {
    render(<InputArea />);
    const button = screen.getByRole('button', { name: /Create Task/i });
    
    // We need to enable the button by typing and then clearing, or just check the disabled state
    // But our button is disabled if title.trim() is empty.
    expect(button).toBeDisabled();
  });

  test('successfully adds a task', async () => {
    // Arrange: Mock success
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify("new-id-123"), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );

    render(<InputArea />);
    const input = screen.getByPlaceholderText(/Add a new task.../i);
    const button = screen.getByRole('button', { name: /Create Task/i });

    // Act
    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(input).toHaveValue(''); // Input cleared on success
    });
    
    expect(global.fetch).toHaveBeenCalled();
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    const url = typeof fetchCall === 'string' ? fetchCall : fetchCall.url;
    expect(url).toContain('/api/todo');
  });
});
