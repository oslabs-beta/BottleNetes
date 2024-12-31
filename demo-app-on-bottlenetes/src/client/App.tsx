import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { theme } from './theme';
import CpuTest from './components/CpuTest';
import MemoryTest from './components/MemoryTest';
import NetworkTest from './components/NetworkTest';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          padding: '2rem 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth='md'>
          <Typography
            variant='h3'
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.main,
              textAlign: 'center',
              mb: 4,
            }}
          >
            Test App for Bottlenetes
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 5,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              alignItems: 'center',
            }}
          >
            <Grid container spacing={4} justifyContent='center'>
              <Grid item xs={12} sm={6}>
                <CpuTest />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MemoryTest />
              </Grid>
              <Grid item xs={12}>
                <NetworkTest />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;
