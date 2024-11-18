import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import conductor from "./routes/conductor.js";
import roleAssignment from "./routes/roleAssignment.js";

const app = new Hono();
app.use("/*", cors());

// Mount routes
app.route("/", conductor);
app.route("/", roleAssignment);

const port = 5001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});