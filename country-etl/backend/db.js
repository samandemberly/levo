import postgres from 'pg';
const { Pool } = postgres;

const pool = new Pool({
  user: 'cole',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

export default pool;
