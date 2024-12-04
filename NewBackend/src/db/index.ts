import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const queryClient = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: queryClient, schema });

export default db;
