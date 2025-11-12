import express from 'express';
import cron from 'node-cron';
import cors from 'cors'
import { runETL } from './etl.js';
import { summarizeAll, summarizeOne, getCountryNames } from './data.js'
import pool from './db.js';

const app = express();
app.use(cors())

const PORT = 3000;

(async () => {
  try {
    console.log('Running ETL...');
    await runETL();
    console.log('ETL finished.');
  } catch (err) {
    console.error('ETL error:', err);
  }
})();

cron.schedule('* * * * *', async () => {
  console.log('Running ETL...');
  try {
    await runETL();
    console.log('ETL completed successfully.');
  } catch (err) {
    console.error('ETL failed:', err);
  }
});

app.get('/summary', async (req, res) => {
  try {
    const summary = await summarizeAll();
    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/summary/:countryName', async (req, res) => {
  try {
    const countryName = req.params.countryName;
    const countryData = await summarizeOne(countryName);
    res.json(countryData);
  } catch (err) {
    console.error('Error fetching countryData:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/countryNames', async (req, res) => {
  try {
    const countryNames = await getCountryNames();
    res.json(countryNames);
  } catch (err) {
    console.error('Error fetching countryNames:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await pool.end();
  console.log('\nDatabase connection closed. Server stopped.');
  process.exit(0);
});

export default app;
