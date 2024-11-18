// models/Location.js
const pool = require('../config/db');

const Location = {
  async addLocation(location) {
    const result = await pool.query(
      `INSERT INTO locations (name) VALUES ($1) RETURNING *`,
      [location]
    );
    return result.rows[0];
  },

  async getLocations() {
    const result = await pool.query(`SELECT name, count(name) FROM locations GROUP BY name`);
    return result.rows;
  },

  async clearLocations() {
    await pool.query(`DELETE FROM locations`);
  }
};

module.exports = Location;
