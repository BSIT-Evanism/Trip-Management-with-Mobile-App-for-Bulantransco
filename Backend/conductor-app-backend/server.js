// server.js

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

const pool = new Pool({
  user: process.env.CONDUCTOR_DB_USER,
  host: process.env.CONDUCTOR_DB_HOST,
  database: process.env.CONDUCTOR_DB_NAME,
  password: process.env.CONDUCTOR_DB_PASSWORD,
  port: process.env.CONDUCTOR_DB_PORT,
});

app.use(express.json());

// Fetch all destinations with current passenger counts
app.get("/destinations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, location_name, count FROM locations"
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a passenger to a destination
app.post("/passengers", async (req, res) => {
  const { destinationId } = req.body;
  try {
    const result = await pool.query(
      "UPDATE locations SET count = count + 1 WHERE id = $1 RETURNING *",
      [destinationId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding passenger:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Fetch destinations with passenger counts greater than zero for the Departure dropdown
app.get("/departure-destinations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, location_name, count FROM locations WHERE count > 0"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching departure destinations:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Deboard passengers from a destination and return updated destinations
app.post("/deboard", async (req, res) => {
  const { destinationId, multiplier } = req.body;

  // Validate input parameters
  if (!destinationId || multiplier == null) {
    return res
      .status(400)
      .json({ error: "Destination ID and multiplier are required." });
  }

  if (multiplier <= 0) {
    return res
      .status(400)
      .json({ error: "Multiplier must be greater than zero." });
  }

  try {
    // Fetch the current passenger count for the destination
    const destinationResult = await pool.query(
      "SELECT count FROM locations WHERE id = $1",
      [destinationId]
    );

    // If the destination does not exist, return an error
    if (destinationResult.rowCount === 0) {
      return res.status(404).json({ error: "Destination not found." });
    }

    const currentCount = destinationResult.rows[0].count;

    // If the current count is less than the multiplier, prevent deboarding
    if (currentCount < multiplier) {
      return res.status(400).json({
        error: `Cannot deboard ${multiplier} passengers. Only ${currentCount} are available at this destination.`,
      });
    }

    // Proceed with updating the count
    const result = await pool.query(
      "UPDATE locations SET count = GREATEST(count - $1, 0) WHERE id = $2 RETURNING *",
      [multiplier, destinationId]
    );

    // Fetch updated list of destinations with count > 0
    const updatedDestinations = await pool.query(
      "SELECT id, location_name, count FROM locations WHERE count > 0"
    );

    res.json({
      message: `Successfully deboarded ${multiplier} passenger(s) from destination.`,
      destinations: updatedDestinations.rows,
    });
  } catch (error) {
    console.error("Error deboarding passengers:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
