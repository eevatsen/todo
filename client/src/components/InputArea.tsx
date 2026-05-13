import { useState } from "react";
import { TextField, Button, Paper, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCreateTodoMutation } from "../store/api/todoApi";
import { Dayjs } from "dayjs";

function InputArea() {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await createTodo({ 
        title, 
        deadline: deadline ? deadline.toISOString() : undefined 
      }).unwrap();
      setTitle(""); // Clear input on success
      setDeadline(null);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
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