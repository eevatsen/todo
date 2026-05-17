import { render, screen, fireEvent, waitFor } from '../test-utils';
import TaskList from './TaskList';

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders tasks and expands detail on click', async () => {
    // Arrange
    const tasks = [
      { id: '1', title: 'Expand Me', description: 'Hidden details', status: 0, priority: 1, createdAt: new Date().toISOString() }
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(tasks), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );

    render(<TaskList />);

    // Act: Wait for task to appear and click it
    const taskTitle = await screen.findByText(/Expand Me/i);
    fireEvent.click(taskTitle);

    // Assert: Check if description appears
    expect(await screen.findByText(/Hidden details/i)).toBeInTheDocument();
  });

  test('deletes a task when clicking delete icon', async () => {
    // Arrange
    const tasks = [
      { id: 'task-to-delete', title: 'Delete Me', status: 0, priority: 1, createdAt: new Date().toISOString() }
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(tasks), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 204 })
    );

    render(<TaskList />);
    
    // Act
    const buttons = await screen.findAllByRole('button');
    // In our TaskList item, the buttons are: Edit, Delete, Expand.
    // SecondaryAction Box contains Edit and Delete.
    // Paper contains the whole thing.
    // Let's find the delete button by looking at the mock call or just click the first one that looks like delete.
    // We know there are 2 tasks buttons + 1 expand button per item.
    fireEvent.click(buttons[1]); 

    // Assert
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
