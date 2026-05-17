import { useState } from "react";
import { TextField, Button, Paper, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCreateTodoMutation, TodoPriority } from "../store/api/todoApi";
import { Dayjs } from "dayjs";

function InputArea() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.Medium);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setError(null);
      await createTodo({ 
        title, 
        priority,
        deadline: deadline ? deadline.toISOString() : undefined 
      }).unwrap();
      setTitle("");
      setDeadline(null);
      setPriority(TodoPriority.Medium);
    } catch (err: any) {
      console.error("Failed to add task:", err);
      if (err.data?.errors?.Title) {
        setError(err.data.errors.Title[0]);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          label="Title"
          size="small"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setError(null);
          }}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          error={!!error}
          helperText={error}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                disabled={isLoading}
            >
                <MenuItem value={TodoPriority.Low}>Low</MenuItem>
                <MenuItem value={TodoPriority.Medium}>Medium</MenuItem>
                <MenuItem value={TodoPriority.High}>High</MenuItem>
                <MenuItem value={TodoPriority.Urgent}>Urgent</MenuItem>
            </Select>
        </FormControl>
        <DatePicker
          label="Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          slotProps={{ textField: { size: 'small', sx: { width: 200 } } }}
          disabled={isLoading}
        />
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        disableElevation 
        onClick={handleAdd}
        disabled={isLoading || !title.trim()}
        sx={{ alignSelf: 'flex-end' }}
      >
        {isLoading ? "..." : "Create Task"}
      </Button>
    </Paper>
  );
}

export default InputArea;
