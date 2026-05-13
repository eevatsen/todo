import { useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material"
import InputArea from "./components/InputArea"
import TaskList from "./components/TaskList"
import TaskCalendar from "./components/TaskCalendar"
import { useGetTodosQuery } from "./store/api/todoApi"

function App() {
  const [tab, setTab] = useState(0);
  const { data: todos = [] } = useGetTodosQuery();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '3rem' }}>
          Todo
        </Typography>
      </Box>
      
      <InputArea />

      <Box sx={{ mt: 4, borderBottom: '2px solid #000' }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="List View" sx={{ fontWeight: 900 }} />
          <Tab label="Calendar View" sx={{ fontWeight: 900 }} />
        </Tabs>
      </Box>

      {tab === 0 ? (
        <TaskList />
      ) : (
        <TaskCalendar todos={todos} />
      )}
    </Container>
  )
}

export default App
