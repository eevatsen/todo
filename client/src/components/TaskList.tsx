import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Checkbox, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { 
  useGetTodosQuery, 
  useDeleteTodoMutation, 
  useUpdateTodoMutation, 
  TodoStatus 
} from "../store/api/todoApi";
import type { TodoItem } from "../store/api/todoApi";

const TaskList = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();

  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Failed to load tasks.
      </Typography>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <Typography sx={{ mt: 4, textAlign: 'center', opacity: 0.5 }}>
        Your list is empty :C
      </Typography>
    );
  }

  // 4. Toggle Status Logic (Todo <-> Done)
  const handleToggle = (todo: TodoItem) => {
    const newStatus = todo.status === TodoStatus.Done ? TodoStatus.Todo : TodoStatus.Done;
    updateTodo({ ...todo, status: newStatus });
  };

  return (
    <List sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {todos.map((todo) => (
        <Paper 
          key={todo.id} 
          sx={{ 
            p: 1, 
            backgroundColor: todo.status === TodoStatus.Done ? '#f0f0f0' : '#fff',
            opacity: todo.status === TodoStatus.Done ? 0.7 : 1 
          }}
        >
          <ListItem
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={() => deleteTodo(todo.id)}
                sx={{ '&:hover': { color: 'secondary.main' } }}
              >
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <Checkbox
              edge="start"
              checked={todo.status === TodoStatus.Done}
              onChange={() => handleToggle(todo)}
              color="primary"
            />
            <ListItemText
              primary={todo.title}
              secondary={todo.deadline ? `Due: ${new Date(todo.deadline).toLocaleDateString()}` : null}
              sx={{ 
                textDecoration: todo.status === TodoStatus.Done ? 'line-through' : 'none',
                '& .MuiListItemText-primary': { fontWeight: 700 }
              }}
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );
};

export default TaskList;
