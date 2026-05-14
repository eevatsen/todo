import { Box, Paper, Typography, Stack } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useUpdateTodoMutation, TodoStatus, TodoPriority } from "../store/api/todoApi";
import type { TodoItem } from "../store/api/todoApi";

const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
        case TodoPriority.Urgent: return "#FF0000";
        case TodoPriority.High: return "#FF69B4";
        case TodoPriority.Low: return "#4CAF50";
        default: return "#000000";
    }
};

interface KanbanBoardProps {
    todos: TodoItem[];
}

interface Column {
    id: string;
    title: string;
    status: TodoStatus;
}

const columns: Column[] = [
    { id: "todo", title: "Todo", status: TodoStatus.Todo },
    { id: "in-progress", title: "In Progress", status: TodoStatus.InProgress },
    { id: "done", title: "Done", status: TodoStatus.Done },
];

const KanbanBoard = ({ todos }: KanbanBoardProps) => {
    const [updateTodo] = useUpdateTodoMutation();

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        // If dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Find the todo and its new status
        const todo = todos.find(t => t.id === draggableId);
        const newStatusColumn = columns.find(col => col.id === destination.droppableId);

        if (todo && newStatusColumn) {
            try {
                await updateTodo({
                    ...todo,
                    status: newStatusColumn.status
                }).unwrap();
            } catch (err) {
                console.error("Failed to move task:", err);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Stack 
                direction={{ xs: "column", md: "row" }} 
                spacing={2} 
                sx={{ mt: 4, alignItems: "stretch" }}
            >
                {columns.map((column) => {
                    const columnTodos = todos.filter(t => t.status === column.status);
                    
                    return (
                        <Box key={column.id} sx={{ flex: 1, minWidth: 250 }}>
                            <Paper 
                                sx={{ 
                                    p: 2, 
                                    height: "100%", 
                                    backgroundColor: "#f5f5f5",
                                    border: "2px solid #000",
                                    minHeight: "400px"
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 900, 
                                        mb: 2, 
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        borderBottom: "2px solid #000",
                                        pb: 1
                                    }}
                                >
                                    {column.title} ({columnTodos.length})
                                </Typography>

                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <Box 
                                            {...provided.droppableProps} 
                                            ref={provided.innerRef}
                                            sx={{ minHeight: "300px" }}
                                        >
                                            {columnTodos.map((todo, index) => (
                                                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Paper
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                p: 2,
                                                                mb: 2,
                                                                border: "2px solid #000",
                                                                borderTop: todo.priority >= TodoPriority.High 
                                                                    ? `8px solid ${getPriorityColor(todo.priority)}` 
                                                                    : "2px solid #000",
                                                                backgroundColor: "#fff",
                                                                boxShadow: snapshot.isDragging ? "12px 12px 0px #000" : "4px 4px 0px #000",
                                                                transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                                                                transition: "box-shadow 0.2s, transform 0.2s",
                                                                ...provided.draggableProps.style
                                                            }}
                                                        >
                                                            <Typography sx={{ fontWeight: 700 }}>
                                                                {todo.title}
                                                            </Typography>
                                                            {todo.deadline && (
                                                                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                                                                    Due: {new Date(todo.deadline).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                        </Paper>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Paper>
                        </Box>
                    );
                })}
            </Stack>
        </DragDropContext>
    );
};

export default KanbanBoard;
