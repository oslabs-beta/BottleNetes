import React, { useState, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface MemoryData {
  totalMemMB: string;
  freeMemMB: string;
}

const MemoryTest: React.FC = () => {
  const [memoryUsage, setMemoryUsage] = useState<MemoryData | null>(null);
  const [allocating, setAllocating] = useState<boolean>(false);
  const [allocationSize, setAllocationSize] = useState<number>(100);
  const stopAllocationRef = useRef<boolean>(false);
  const memoryChunks = useRef<Array<Array<number>>>([]);

  const handleMemoryTest = async () => {
    try {
      const response = await fetch('/api/memory');
      const data: MemoryData = await response.json();
      setMemoryUsage(data);
    } catch (error) {
      console.error('Error fetching memory usage:', error);
    }
  };

  const handleMemoryAllocation = async () => {
    setAllocating(true);
    stopAllocationRef.current = false;
    memoryChunks.current = [];

    try {
      // Allocate memory in chunks of 1MB
      const numbersPer1MB = (1024 * 1024) / 8; // 8 bytes per number
      const totalChunks = Math.floor(allocationSize);

      for (let i = 0; i < totalChunks && !stopAllocationRef.current; i++) {
        const chunk = new Array(numbersPer1MB).fill(0).map(() => Math.random());
        memoryChunks.current.push(chunk);
        // Update memory usage
        await handleMemoryTest();
        // Allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Memory allocation error:', error);
    }

    setAllocating(false);
  };

  const handleStop = () => {
    stopAllocationRef.current = true;
    memoryChunks.current = []; // Release memory
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <Tooltip title='Get memory usage from backend'>
        <Button variant='contained' onClick={handleMemoryTest}>
          Check Memory
        </Button>
      </Tooltip>

      {allocating ? (
        <Button variant='contained' color='secondary' onClick={handleStop}>
          Stop Allocation
        </Button>
      ) : (
        <Tooltip title='Allocate memory incrementally'>
          <Button variant='contained' onClick={handleMemoryAllocation}>
            Test Memory
          </Button>
        </Tooltip>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type='number'
          value={allocationSize}
          onChange={(e) => setAllocationSize(Number(e.target.value))}
          disabled={allocating}
          style={{ width: '100px' }}
        />
        <Tooltip title='Enter the amount of memory to allocate in MB. Start with around 100MB and increase gradually. Too large numbers may crash your browser.'>
          <HelpOutlineIcon fontSize='small' />
        </Tooltip>
      </div>

      {memoryUsage && (
        <div style={{ marginTop: 10 }}>
          <p>Total Memory: {memoryUsage.totalMemMB} MB</p>
          <p>Free Memory: {memoryUsage.freeMemMB} MB</p>
        </div>
      )}
    </div>
  );
};

export default MemoryTest;
