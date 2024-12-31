import React, { useState } from 'react';
import { Tooltip, Button, Box, Typography } from '@mui/material';
import { componentStyles } from './shared-styles';

const NetworkTest: React.FC = () => {
  const [latency, setLatency] = useState<number | null>(null);
  const [fact, setFact] = useState<string>('');

  const handleNetworkTest = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch('/api/network-test');
      const data = await response.json();
      const endTime = performance.now();
      setLatency(endTime - startTime);

      if (data?.fact) {
        setFact(data.fact);
      }
    } catch (error) {
      console.error('Network test error:', error);
      setFact('Failed to fetch cat fact.');
    }
  };

  return (
    <Box sx={componentStyles.wrapper} alignItems='flex-start'>
      <Tooltip title='Calls a public API (catfact.ninja) and measures latency'>
        <Button variant='contained' onClick={handleNetworkTest}>
          Test Network
        </Button>
      </Tooltip>
      {latency !== null && (
        <Box sx={componentStyles.results}>
          <Typography variant='body1'>
            Latency: {latency.toFixed(1)} ms
          </Typography>
          {fact && (
            <Typography variant='body2' sx={{ mt: 1 }}>
              Cat Fact: {fact}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NetworkTest;
