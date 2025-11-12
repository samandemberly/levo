import axios from 'axios';
import pool from './db.js';

async function extract() {
  const url = 'https://restcountries.com/v3.1/independent?fields=languages,name,region,population,area,density';
  const response = await axios.get(url);
  return response.data;
}

function transform(data) {
  return data.map(country => ({
    languages: Object.values(country.languages),
    name: country.name?.common || country.name?.official || 'Unknown',
    region: country.region || 'Unknown',
    population: country.population || 0,
    area: country.area || 0,
    density: country.area ? Math.floor(country.population / country.area) : null,
  }));
}

async function load(countries) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      languages TEXT[],
      name TEXT UNIQUE NOT NULL,
      region TEXT,
      population BIGINT,
      area FLOAT,
      density FLOAT
    )
  `);

  const insertQuery = `
    INSERT INTO countries (name, languages, region, population, area, density)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (name)
    DO UPDATE SET
      population = EXCLUDED.population
    WHERE countries.population IS DISTINCT FROM EXCLUDED.population;
  `;

  for (const c of countries) {
    await pool.query(insertQuery, [
      c.name,
      c.languages,
      c.region,
      c.population,
      c.area,
      c.density,
    ]);
  }
}


export async function runETL() {
  try {
    const raw = await extract();
    const transformed = transform(raw);
    await load(transformed);
  } catch (err) {
    console.error('ETL process failed:', err);
  }
}
