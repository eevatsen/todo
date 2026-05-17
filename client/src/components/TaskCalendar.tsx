import { Box, Paper, Typography, Grid } from "@mui/material";
import dayjs from "dayjs";
import type { TodoItem } from "../store/api/todoApi";

interface TaskCalendarProps {
    todos: TodoItem[];
}

const TaskCalendar = ({ todos }: TaskCalendarProps) => {
    // Get next 14 days
    const days = Array.from({ length: 14 }, (_, i) => dayjs().add(i, 'day'));

    const getTasksForDay = (date: dayjs.Dayjs) => {
        return todos.filter(todo => 
            todo.deadline && dayjs(todo.deadline).isSame(date, 'day')
        );
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 900, textTransform: 'uppercase' }}>
                Upcoming Deadlines
            </Typography>
            <Grid container spacing={2}>
                {days.map((day) => {
                    const tasks = getTasksForDay(day);
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={day.toISOString()}>
                            <Paper 
                                sx={{ 
                                    p: 2, 
                                    height: '100%', 
                                    backgroundColor: day.isSame(dayjs(), 'day') ? 'primary.main' : '#fff',
                                    border: '2px solid #000'
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>
                                    {day.format('ddd, MMM D')}
                                </Typography>
                                {tasks.length > 0 ? (
                                    tasks.map(t => (
                                        <Typography key={t.id} variant="body2" sx={{ fontWeight: 700 }}>
                                            • {t.title}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                        No tasks
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default TaskCalendar;
