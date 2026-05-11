import { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { useCreateTodoMutation } from "../store/api/todoApi";

function InputArea() {
  const [title, setTitle] = useState("");
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await createTodo({ title }).unwrap();
      setTitle(""); // Clear input on success
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
    <Paper sx={{ p: 1, display: 'flex', gap: 1 }}>
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
      <Button 
        variant="contained" 
        color="primary" 
        disableElevation 
        onClick={handleAdd}
        disabled={isLoading || !title.trim()}
      >
        {isLoading ? "..." : "Add"}
      </Button>
    </Paper>
  );
}

export default InputArea;