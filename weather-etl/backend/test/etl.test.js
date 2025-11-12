import request from 'supertest';
import { summarizeAll, summarizeOne, getCountryNames } from '../data.js';
import { runETL } from '../etl.js';
import app from '../server.js';
import pool from '../db.js';

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS countries;');
  await runETL();
});

afterAll(async () => {
  await pool.end();
});

test('ETL should create and populate countries table', async () => {

  const result = await pool.query('SELECT COUNT(*) FROM countries;');
  const count = parseInt(result.rows[0].count, 10);

  expect(count).toBeGreaterThan(0);
});


test('Summarize should return countries summary', async () => {
  const summary = await summarizeAll();

  expect(Array.isArray(summary)).toBe(true);
  expect(summary.length).toBeGreaterThan(0);

  const first = summary[0];
  expect(first).toHaveProperty('region');
  expect(first).toHaveProperty('name');
  expect(first).toHaveProperty('population');
});

test('Summarize should return detailed country statistics', async () => {
  const country = await summarizeOne('Zambia');

  expect(country).toHaveProperty('region');
  expect(country).toHaveProperty('name');
  expect(country).toHaveProperty('population');
  expect(country).toHaveProperty('density');
  expect(country).toHaveProperty('area');
  expect(country).toHaveProperty('languages');
});

test('Summarize should return country names', async () => {
  const names = await getCountryNames();

  expect(Array.isArray(names)).toBe(true);
  expect(names.length).toBeGreaterThan(0);
});

test('GET /summary should return JSON with region stats', async () => {
  const res = await request(app)
  .get('/summary')
  .expect(200);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body[0]).toHaveProperty('region');
});
