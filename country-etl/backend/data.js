import pool from './db.js';

export async function summarizeAll() {
  const result = await pool.query(`
    SELECT name, population, region FROM countries
    GROUP BY name, population, region
    ORDER BY name DESC;
  `);
  return result.rows;
}

export async function summarizeOne(name) {
  const result = await pool.query(`
    SELECT * FROM countries
    WHERE name = $1;
  `, [name]);

  if (result.rows.length) {
    return result.rows[0]
  } else {
    return null;
  }

}

export async function getCountryNames() {
  const result = await pool.query(`
    SELECT name FROM countries
    ORDER BY name DESC;
  `);
  return result.rows.map((c) => c.name);
}
