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
  Chip,
  Collapse,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  useGetTodosQuery, 
  useDeleteTodoMutation, 
  useUpdateTodoMutation, 
  TodoStatus,
  TodoPriority 
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

const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
        case TodoPriority.Urgent: return "#FF0000"; // Red
        case TodoPriority.High: return "#FF69B4"; // Pink
        case TodoPriority.Low: return "#4CAF50"; // Green
        default: return "#FFD700"; // Yellow
    }
};

const getPriorityLabel = (priority: TodoPriority) => {
    switch (priority) {
        case TodoPriority.Urgent: return "URGENT";
        case TodoPriority.High: return "High";
        case TodoPriority.Low: return "Low";
        default: return "Medium";
    }
};

const TaskList = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isEditDialogOpen, setIsEditOpen] = useState(false);
  
  // State for expanded items
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  const handleEditClick = (e: React.MouseEvent, todo: TodoItem) => {
    e.stopPropagation(); // Prevent expansion when clicking edit
    setSelectedTodo(todo);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent expansion when clicking delete
    deleteTodo(id);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <>
      <List sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {todos.map((todo) => {
          const isExpanded = expandedIds.has(todo.id);
          return (
            <Paper 
              key={todo.id} 
              onClick={() => toggleExpand(todo.id)}
              sx={{ 
                p: 1, 
                backgroundColor: todo.status === TodoStatus.Done ? '#f0f0f0' : '#fff',
                opacity: todo.status === TodoStatus.Done ? 0.7 : 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: todo.priority >= TodoPriority.High 
                    ? `4px solid ${getPriorityColor(todo.priority)}` 
                    : '2px solid #000',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '10px 10px 0px #000'
                }
              }}
            >
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={getPriorityLabel(todo.priority)} 
                      size="small" 
                      sx={{ 
                        mr: 1, 
                        borderRadius: 0, 
                        fontWeight: 900, 
                        backgroundColor: getPriorityColor(todo.priority),
                        color: todo.priority >= TodoPriority.High ? '#fff' : '#000',
                        display: { xs: 'none', sm: 'flex' }
                      }} 
                    />
                    <IconButton 
                      onClick={(e) => handleEditClick(e, todo)}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleDeleteClick(e, todo.id)}
                      sx={{ '&:hover': { color: 'secondary.main' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        ml: 1,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                }
                disablePadding
              >
                <Checkbox
                  edge="start"
                  checked={todo.status === TodoStatus.Done}
                  onClick={(e) => e.stopPropagation()} // Stop click from bubbling to Paper
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggle(todo);
                  }}
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

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2, p: 2, borderTop: '2px solid #000', backgroundColor: '#fafafa' }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {todo.description || "No description provided for this task."}
                  </Typography>
                  
                  <Divider sx={{ my: 2, borderColor: '#000' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Created: {new Date(todo.createdAt).toLocaleString()}
                    </Typography>
                    {todo.deadline && (
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Deadline: {new Date(todo.deadline).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
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
