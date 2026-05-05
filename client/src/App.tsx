import { Container, Typography, Box } from "@mui/material"
import InputArea from "./components/InputArea"

function App() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '3rem' }}>
          Todo
        </Typography>
      </Box>
      <InputArea />
    </Container>
  )
}

export default App
