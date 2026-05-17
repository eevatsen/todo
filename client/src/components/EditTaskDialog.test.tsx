import { render, screen, fireEvent, waitFor } from '../test-utils';
import EditTaskDialog from './EditTaskDialog';
import { TodoStatus, TodoPriority } from '../store/api/todoApi';

describe('EditTaskDialog', () => {
  const mockTodo = {
    id: 'edit-id',
    title: 'Original Title',
    description: 'Original Description',
    status: TodoStatus.Todo,
    priority: TodoPriority.Medium,
    createdAt: new Date().toISOString(),
  };

  test('renders with todo data', () => {
    render(<EditTaskDialog open={true} todo={mockTodo} onClose={() => {}} />);
    
    expect(screen.getByDisplayValue(/Original Title/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Original Description/i)).toBeInTheDocument();
  });

  test('calls onClose when cancel is clicked', () => {
    const onClose = jest.fn();
    render(<EditTaskDialog open={true} todo={mockTodo} onClose={onClose} />);
    
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  test('successfully updates a task', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 204 })
    );
    const onClose = jest.fn();

    render(<EditTaskDialog open={true} todo={mockTodo} onClose={onClose} />);
    const titleInput = screen.getByLabelText(/Title/i);
    const saveButton = screen.getByText(/Save Changes/i);

    // Act
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.click(saveButton);

    // Assert
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
    
    expect(global.fetch).toHaveBeenCalled();
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    const url = typeof fetchCall === 'string' ? fetchCall : fetchCall.url;
    expect(url).toContain('todo/edit-id');
  });
});
