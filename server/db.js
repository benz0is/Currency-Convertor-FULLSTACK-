const { Pool } = require("pg");
const pool = new Pool();

pool.query(
  "CREATE TABLE IF NOT EXISTS valiutos ( id BIGSERIAL NOT NULL PRIMARY KEY, currency TEXT NOT NULL UNIQUE, rate TEXT NOT NULL)",
  (req, res) => {
    console.log(req, res);
  }
);
pool.query(
  "CREATE TABLE IF NOT EXISTS history(id BIGSERIAL NOT NULL PRIMARY KEY,from_num TEXT NOT NULL,to_cur TEXT NOT NULL)",
  (req, res) => {
    console.log(req, res);
  }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
