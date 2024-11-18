const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection pool setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "role_assignment",
  password: "12345",
  port: 5432,
});

// DELETE route to clear all assignments
app.delete("/assignments", async (req, res) => {
  try {
    // Delete all records from the 'assignments' table
    await pool.query("DELETE FROM assignments");
    res.status(200).send({ message: "Assignments cleared successfully" });
  } catch (error) {
    console.error("Error clearing assignments:", error);
    res.status(500).send({ message: "Failed to clear assignments" });
  }
});

// Route to get all conductors
app.get("/conductors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM conductors");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving conductors:", error);
    res.status(500).send("Error retrieving conductors");
  }
});

// Route to get all inspectors
app.get("/inspectors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inspectors");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving inspectors:", error);
    res.status(500).send("Error retrieving inspectors");
  }
});

// Route to get all inspection points
app.get("/inspection-points", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inspection_points");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving inspection points:", error);
    res.status(500).send("Error retrieving inspection points");
  }
});

// POST route to assign conductor, inspector, and inspection point
app.post("/assignments", async (req, res) => {
  const { conductor_id, inspector_id, inspection_point_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO assignments (conductor_id, inspector_id, inspection_point_id) VALUES ($1, $2, $3) RETURNING *",
      [conductor_id, inspector_id, inspection_point_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).send("Error creating assignment");
  }
});

// GET route to fetch all assignments
app.get("/assignments", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT a.id, c.name as conductor_name, i.name as inspector_name, ip.name as inspection_point FROM assignments a JOIN conductors c ON a.conductor_id = c.id JOIN inspectors i ON a.inspector_id = i.id JOIN inspection_points ip ON a.inspection_point_id = ip.id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).send("Error retrieving assignments");
  }
});

// DELETE route to delete a specific assignment
app.delete("/assignments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM assignments WHERE id = $1", [id]);
    res.status(200).send({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).send("Error deleting assignment");
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.delete("/assignments", async (req, res) => {
  try {
    console.log("DELETE request received for clearing assignments");
    await pool.query("DELETE FROM assignments");
    res.status(200).send({ message: "Assignments cleared successfully" });
  } catch (error) {
    console.error("Error clearing assignments:", error);
    res.status(500).send({ message: "Failed to clear assignments" });
  }
});
