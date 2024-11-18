// config/conductorDb.js
const { Pool } = require('pg');
require('dotenv').config();

const conductorDbPool = new Pool({
  user: process.env.CONDUCTOR_DB_USER,
  host: process.env.CONDUCTOR_DB_HOST,
  database: process.env.CONDUCTOR_DB_NAME,
  password: process.env.CONDUCTOR_DB_PASSWORD,
  port: process.env.CONDUCTOR_DB_PORT,
});

module.exports = conductorDbPool;
