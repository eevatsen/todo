import { render, screen } from '../test-utils';
import TaskList from './TaskList';

describe('TaskList', () => {
  test('renders tasks from API', async () => {
    // Arrange: Mock a successful fetch response
    const tasks = [
      { id: '1', title: 'Test Task 1', status: 0, createdAt: new Date().toISOString() },
      { id: '2', title: 'Test Task 2', status: 2, createdAt: new Date().toISOString() },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<TaskList />);
    
    // Assert: Check for titles
    expect(await screen.findByText(/Test Task 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test Task 2/i)).toBeInTheDocument();
  });

  test('renders error message when API fails', async () => {
    // Arrange: Mock a failed fetch
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Down'));

    render(<TaskList />);
    
    expect(await screen.findByText(/Failed to load tasks/i)).toBeInTheDocument();
  });
});
