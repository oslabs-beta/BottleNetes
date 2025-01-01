import React, { useState, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Decimal from 'decimal.js';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CpuTest: React.FC = () => {
  const [piValue, setPiValue] = useState<string>('');
  const [calculating, setCalculating] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(10000);
  const stopCalculationRef = useRef<boolean>(false);

  const computePiChunk = (
    start: number,
    end: number,
    sum: Decimal,
    sign: Decimal
  ): [Decimal, Decimal] => {
    for (let i = start; i < end && !stopCalculationRef.current; i++) {
      sum = sum.plus(sign.dividedBy(new Decimal(2.0 * i + 1.0)));
      sign = sign.negated();
    }
    return [sum, sign];
  };

  const handleComputePi = async () => {
    setCalculating(true);
    stopCalculationRef.current = false;
    Decimal.set({ precision: iterations });

    let sum = new Decimal(0);
    let sign = new Decimal(1);
    const chunkSize = 1000;

    for (
      let i = 0;
      i < iterations && !stopCalculationRef.current;
      i += chunkSize
    ) {
      const end = Math.min(i + chunkSize, iterations);
      [sum, sign] = computePiChunk(i, end, sum, sign);
      setPiValue(sum.times(4).toString());
      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (!stopCalculationRef.current) {
      setPiValue(sum.times(4).toString());
    }
    setCalculating(false);
  };

  const handleStop = () => {
    stopCalculationRef.current = true;
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
      {calculating ? (
        <>
          <Button variant='contained' color='secondary' onClick={handleStop}>
            Stop Calculation
          </Button>
          <div>Calculating Pi up to {iterations} digits...</div>
        </>
      ) : (
        <Tooltip title='Test CPU usage by computing Pi'>
          <Button variant='contained' onClick={handleComputePi}>
            Test CPU
          </Button>
        </Tooltip>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type='number'
          value={iterations}
          onChange={(e) => setIterations(Number(e.target.value))}
          disabled={calculating}
          style={{ width: '100px' }}
        />
        <Tooltip title='Enter the number of iterations for Pi calculation. Start with around 10000 and increase gradually. Too large numbers may freeze your browser.'>
          <HelpOutlineIcon fontSize='small' />
        </Tooltip>
      </div>

      {!calculating && piValue && (
        <p>Pi Digits Calculated: {piValue.length - 1}</p>
      )}
    </div>
  );
};

export default CpuTest;
