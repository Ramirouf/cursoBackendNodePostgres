const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "Ramiro",
  password: "ADMIN123",
  database: "my_store"
});


module.exports = pool;
