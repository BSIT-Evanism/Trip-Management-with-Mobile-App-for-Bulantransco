const pool = require('../db');

// Add a new location
const addLocation = async (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    await pool.query('INSERT INTO locations (location_name) VALUES ($1)', [location]);
    res.status(201).json({ message: 'Location added successfully' });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ error: 'Failed to add location' });
  }
};

// Get all locations with counts
const getAllLocations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT location_name, COUNT(*) as count FROM locations GROUP BY location_name'
    );
    const locations = result.rows.map(row => ({
      location: row.location_name,
      count: parseInt(row.count, 10)
    }));
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Clear all locations
const clearLocations = async (req, res) => {
  try {
    await pool.query('DELETE FROM locations');
    res.status(200).json({ message: 'All locations cleared' });
  } catch (error) {
    console.error('Error clearing locations:', error);
    res.status(500).json({ error: 'Failed to clear locations' });
  }
};

module.exports = { addLocation, getAllLocations, clearLocations };
