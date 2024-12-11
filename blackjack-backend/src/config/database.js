import pg from 'pg';

const pool = new pg.Pool({
    user: 'root123',
    database: 'postgres',
    password: 'root123',
    host: 'localhost',
    port: 5432,
});


export default pool;