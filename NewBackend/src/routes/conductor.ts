import { Hono } from "hono";
import pkg from "pg";

const { Pool } = pkg;

const conductorPool = new Pool({
  user: process.env.CONDUCTOR_DB_USER || "postgres",
  host: process.env.CONDUCTOR_DB_HOST || "127.0.0.1",
  database: process.env.CONDUCTOR_DB_NAME || "conductor_app_db",
  password: process.env.CONDUCTOR_DB_PASSWORD || "392002",
  port: Number(process.env.CONDUCTOR_DB_PORT) || 5432,
});

const conductor = new Hono();

conductor.get("/destinations", async (c) => {
  try {
    const result = await conductorPool.query(
      "SELECT id, location_name, count FROM locations"
    );
    return c.json(result.rows);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return c.json({ error: "Database error" }, 500);
  }
});

conductor.post("/passengers", async (c) => {
  const { destinationId } = await c.req.json();
  try {
    const result = await conductorPool.query(
      "UPDATE locations SET count = count + 1 WHERE id = $1 RETURNING *",
      [destinationId]
    );
    return c.json(result.rows[0]);
  } catch (error) {
    return c.json({ error: "Database error" }, 500);
  }
});

conductor.get("/departure-destinations", async (c) => {
  try {
    const result = await conductorPool.query(
      "SELECT id, location_name, count FROM locations WHERE count > 0"
    );
    return c.json(result.rows);
  } catch (error) {
    return c.json({ error: "Database error" }, 500);
  }
});

conductor.post("/deboard", async (c) => {
  const { destinationId, multiplier } = await c.req.json();

  if (!destinationId || multiplier == null) {
    return c.json(
      { error: "Destination ID and multiplier are required." },
      400
    );
  }

  if (multiplier <= 0) {
    return c.json({ error: "Multiplier must be greater than zero." }, 400);
  }

  try {
    const destinationResult = await conductorPool.query(
      "SELECT count FROM locations WHERE id = $1",
      [destinationId]
    );

    if (destinationResult.rowCount === 0) {
      return c.json({ error: "Destination not found." }, 404);
    }

    const currentCount = destinationResult.rows[0].count;

    if (currentCount < multiplier) {
      return c.json(
        {
          error: `Cannot deboard ${multiplier} passengers. Only ${currentCount} are available.`,
        },
        400
      );
    }

    await conductorPool.query(
      "UPDATE locations SET count = GREATEST(count - $1, 0) WHERE id = $2",
      [multiplier, destinationId]
    );

    const updatedDestinations = await conductorPool.query(
      "SELECT id, location_name, count FROM locations WHERE count > 0"
    );

    return c.json({
      message: `Successfully deboarded ${multiplier} passenger(s)`,
      destinations: updatedDestinations.rows,
    });
  } catch (error) {
    return c.json({ error: "Database error" }, 500);
  }
});

export default conductor;
