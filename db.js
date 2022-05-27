/*
Database connection pooling is a method used to keep database connections open
so they can be reused by others.
As the overhead of creating and closing a connection increasing when the application
scales up.
*/

const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    port: process.env.DB_PORT,
    database: `${process.env.DB_DATABASE}`,
});

module.exports = pool;