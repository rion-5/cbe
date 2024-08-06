import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  user: import.meta.env.DB_USER,
  host: import.meta.env.DB_HOST,
  database: import.meta.env.DB_DATABASE, 
  password: import.meta.env.DB_PASSWORD,
  port: import.meta.env.DB_PORT,
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}


