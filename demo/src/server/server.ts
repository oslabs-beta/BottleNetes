import express, { Request, Response } from 'express';
import cors from 'cors';
import os from 'os';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 4000;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

app.use(cors());

app.get('/api/memory', (req: Request, res: Response) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  res.json({
    totalMemMB: (totalMem / (1024 * 1024)).toFixed(2),
    freeMemMB: (freeMem / (1024 * 1024)).toFixed(2),
  });
});

app.get('/api/network-test', async (req: Request, res: Response) => {
  try {
    const catfact = await fetch(EXTERNAL_API_URL);
    if (!catfact.ok) {
      return res.status(500).json({ error: 'Failed to fetch external API' });
    }
    const data = await catfact.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
