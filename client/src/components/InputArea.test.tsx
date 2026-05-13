import { render, screen, fireEvent } from '../test-utils';
import InputArea from './InputArea';

describe('InputArea', () => {
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

  test('button is disabled when input is empty', () => {
    render(<InputArea />);
    const button = screen.getByRole('button', { name: /Create Task/i });
    
    expect(button).toBeDisabled();
  });
});
