import { /* Box, */ TextField, Button, Paper } from "@mui/material";

function InputArea() {
  return (
    <Paper sx={{ p: 1, display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a new task..."
        size="small"
      />
      <Button variant="contained" color="primary" disableElevation>
        Add
      </Button>
    </Paper>
  );
}

export default InputArea;