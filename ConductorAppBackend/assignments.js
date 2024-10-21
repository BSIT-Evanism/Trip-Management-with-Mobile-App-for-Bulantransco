const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'role_assignment', // Ensure this matches your main DB
  password: '12345',
  port: 5432,
});

// POST route for assigning conductor, inspector, and inspection point
router.post('/assignments', async (req, res) => {
  const { conductor_id, inspector_id, inspection_point_id } = req.body; // Include inspection point ID

  try {
    const result = await pool.query(
      'INSERT INTO assignments (conductor_id, inspector_id, inspection_point_id) VALUES ($1, $2, $3) RETURNING *',
      [conductor_id, inspector_id, inspection_point_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error assigning conductor, inspector, and inspection point:', err);
    res.status(500).send('Server Error');
  }
});

// GET route to fetch all assignments with inspection points
router.get('/assignments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT assignments.id, 
              conductors.name AS conductor_name, 
              inspectors.name AS inspector_name, 
              inspection_points.name AS inspection_point_name 
       FROM assignments 
       INNER JOIN conductors ON assignments.conductor_id = conductors.id 
       INNER JOIN inspectors ON assignments.inspector_id = inspectors.id 
       INNER JOIN inspection_points ON assignments.inspection_point_id = inspection_points.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
