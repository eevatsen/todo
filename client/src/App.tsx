import { useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material"
import InputArea from "./components/InputArea"
import TaskList from "./components/TaskList"
import TaskCalendar from "./components/TaskCalendar"
import KanbanBoard from "./components/KanbanBoard"
import { useGetTodosQuery } from "./store/api/todoApi"

function App() {
  const [tab, setTab] = useState(0);
  const { data: todos = [] } = useGetTodosQuery();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '3rem' }}>
          Todo
        </Typography>
      </Box>
      
      <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
        <InputArea />
      </Box>

      <Box sx={{ mt: 4, borderBottom: '2px solid #000' }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          textColor="secondary"
          indicatorColor="secondary"
          centered
        >
          <Tab label="List View" sx={{ fontWeight: 900 }} />
          <Tab label="Calendar View" sx={{ fontWeight: 900 }} />
          <Tab label="Kanban Board" sx={{ fontWeight: 900 }} />
        </Tabs>
      </Box>

      {tab === 0 && <TaskList />}
      {tab === 1 && <TaskCalendar todos={todos} />}
      {tab === 2 && <KanbanBoard todos={todos} />}
    </Container>
  )
}

export default App
