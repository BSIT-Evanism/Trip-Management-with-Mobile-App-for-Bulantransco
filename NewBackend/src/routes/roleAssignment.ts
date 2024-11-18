import { Hono } from "hono";
import pkg from "pg";

const { Pool } = pkg;

const roleAssignmentPool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "role_assignment",
  password: "392002",
  port: 5432,
});

const roleAssignment = new Hono();

roleAssignment.get("/conductors", async (c) => {
  try {
    const result = await roleAssignmentPool.query("SELECT * FROM conductors");
    return c.json(result.rows);
  } catch (error) {
    return c.json({ error: "Error retrieving conductors" }, 500);
  }
});

roleAssignment.get("/inspectors", async (c) => {
  try {
    const result = await roleAssignmentPool.query("SELECT * FROM inspectors");
    return c.json(result.rows);
  } catch (error) {
    return c.json({ error: "Error retrieving inspectors" }, 500);
  }
});

roleAssignment.get("/inspection-points", async (c) => {
  try {
    const result = await roleAssignmentPool.query(
      "SELECT * FROM inspection_points"
    );
    return c.json(result.rows);
  } catch (error) {
    return c.json({ error: "Error retrieving inspection points" }, 500);
  }
});

roleAssignment.post("/assignments", async (c) => {
  const { conductor_id, inspector_id, inspection_point_id } =
    await c.req.json();
  try {
    const result = await roleAssignmentPool.query(
      "INSERT INTO assignments (conductor_id, inspector_id, inspection_point_id) VALUES ($1, $2, $3) RETURNING *",
      [conductor_id, inspector_id, inspection_point_id]
    );
    return c.json(result.rows[0], 201);
  } catch (error) {
    return c.json({ error: "Error creating assignment" }, 500);
  }
});

roleAssignment.get("/assignments", async (c) => {
  try {
    const result = await roleAssignmentPool.query(
      `SELECT a.id, c.name as conductor_name, i.name as inspector_name, 
       ip.name as inspection_point 
       FROM assignments a 
       JOIN conductors c ON a.conductor_id = c.id 
       JOIN inspectors i ON a.inspector_id = i.id 
       JOIN inspection_points ip ON a.inspection_point_id = ip.id`
    );
    return c.json(result.rows);
  } catch (error) {
    return c.json({ error: "Error retrieving assignments" }, 500);
  }
});

roleAssignment.delete("/assignments/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await roleAssignmentPool.query("DELETE FROM assignments WHERE id = $1", [
      id,
    ]);
    return c.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return c.json({ error: "Error deleting assignment" }, 500);
  }
});

roleAssignment.delete("/assignments", async (c) => {
  try {
    await roleAssignmentPool.query("DELETE FROM assignments");
    return c.json({ message: "Assignments cleared successfully" });
  } catch (error) {
    return c.json({ error: "Failed to clear assignments" }, 500);
  }
});

export default roleAssignment;
