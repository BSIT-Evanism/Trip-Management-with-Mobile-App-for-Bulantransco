import { Pool } from "pg";
import { config } from "dotenv";

config();

export const conductorPool = new Pool({
  user: process.env.CONDUCTOR_DB_USER || "postgres",
  host: process.env.CONDUCTOR_DB_HOST || "127.0.0.1",
  database: process.env.CONDUCTOR_DB_NAME || "conductor_app_db",
  password: process.env.CONDUCTOR_DB_PASSWORD || "392002",
  port: Number(process.env.CONDUCTOR_DB_PORT) || 5432,
});

export const roleAssignmentPool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "role_assignment",
  password: "392002",
  port: 5432,
});
