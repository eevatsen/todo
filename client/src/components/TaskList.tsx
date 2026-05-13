import { useState } from "react";
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Checkbox, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Chip 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { 
  useGetTodosQuery, 
  useDeleteTodoMutation, 
  useUpdateTodoMutation, 
  TodoStatus 
} from "../store/api/todoApi";
import type { TodoItem } from "../store/api/todoApi";
import EditTaskDialog from "./EditTaskDialog";

const getStatusColor = (status: TodoStatus) => {
  switch (status) {
    case TodoStatus.InProgress: return "secondary";
    case TodoStatus.Done: return "success";
    default: return "default";
  }
};

const getStatusLabel = (status: TodoStatus) => {
  switch (status) {
    case TodoStatus.InProgress: return "In Progress";
    case TodoStatus.Done: return "Done";
    default: return "Todo";
  }
};

const TaskList = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isEditDialogOpen, setIsEditOpen] = useState(false);

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

  const handleToggle = (todo: TodoItem) => {
    const newStatus = todo.status === TodoStatus.Done ? TodoStatus.Todo : TodoStatus.Done;
    updateTodo({ ...todo, status: newStatus });
  };

  const handleEditClick = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsEditOpen(true);
  };

  return (
    <>
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
                <Box>
                  <IconButton 
                    onClick={() => handleEditClick(todo)}
                    sx={{ '&:hover': { color: 'primary.main' } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => deleteTodo(todo.id)}
                    sx={{ '&:hover': { color: 'secondary.main' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
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
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      sx={{ 
                        fontWeight: 700,
                        textDecoration: todo.status === TodoStatus.Done ? 'line-through' : 'none' 
                      }}
                    >
                      {todo.title}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(todo.status)} 
                      size="small" 
                      color={getStatusColor(todo.status)}
                      variant={todo.status === TodoStatus.Todo ? "outlined" : "filled"}
                      sx={{ borderRadius: 0, fontWeight: 700, fontSize: '0.65rem' }}
                    />
                  </Box>
                }
                secondary={todo.deadline ? `Due: ${new Date(todo.deadline).toLocaleDateString()}` : null}
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      <EditTaskDialog 
        todo={selectedTodo}
        open={isEditDialogOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
};

export default TaskList;
