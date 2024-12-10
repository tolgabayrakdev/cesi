import pg from 'pg';

const pool = new pg.Pool({
    user: 'root',
    database: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
});


export default pool;