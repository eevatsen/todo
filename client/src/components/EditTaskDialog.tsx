import { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Box
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useUpdateTodoMutation, TodoStatus, TodoPriority } from "../store/api/todoApi";
import type { TodoItem } from "../store/api/todoApi";
import dayjs, { Dayjs } from "dayjs";

interface EditTaskDialogProps {
    todo: TodoItem | null;
    open: boolean;
    onClose: () => void;
}

const EditTaskDialog = ({ todo, open, onClose }: EditTaskDialogProps) => {
    const [updateTodo, { isLoading }] = useUpdateTodoMutation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TodoStatus>(TodoStatus.Todo);
    const [priority, setPriority] = useState<TodoPriority>(TodoPriority.Medium);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description || "");
            setStatus(todo.status);
            setPriority(todo.priority);
            setDeadline(todo.deadline ? dayjs(todo.deadline) : null);
        }
    }, [todo]);

    const handleSave = async () => {
        if (!todo || !title.trim()) return;

        try {
            await updateTodo({
                ...todo,
                title,
                description,
                status,
                priority,
                deadline: deadline ? deadline.toISOString() : undefined
            }).unwrap();
            onClose();
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                Edit Task
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value as TodoStatus)}
                            disabled={isLoading}
                        >
                            <MenuItem value={TodoStatus.Todo}>Todo</MenuItem>
                            <MenuItem value={TodoStatus.InProgress}>In Progress</MenuItem>
                            <MenuItem value={TodoStatus.Done}>Done</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="edit-priority-label">Priority</InputLabel>
                        <Select
                            labelId="edit-priority-label"
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
                </Box>
                <DatePicker
                    label="Deadline"
                    value={deadline}
                    onChange={(newValue) => setDeadline(newValue)}
                    disabled={isLoading}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    color="primary" 
                    disabled={isLoading || !title.trim()}
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTaskDialog;
