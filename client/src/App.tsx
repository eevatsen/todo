import { ThemeProvider, CssBaseline, Container, Typography, Box } from "@mui/material"
import theme from "./theme"
import InputArea from "./components/InputArea"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '3rem' }}>
            Todo
          </Typography>
        </Box>
        <InputArea />
      </Container>
    </ThemeProvider>
  )
}

export default App
