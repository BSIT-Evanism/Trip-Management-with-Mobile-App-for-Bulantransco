import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import cookie from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { auth } from "./routes/auth";
import { conductor } from "./routes/conductor";
import { managersRoute } from "./routes/manager";
import { logger } from "@tqman/nice-logger";
import { inspectorRoutes } from "./routes/inspector";
import db from "./db";

const app = new Elysia()
  .use(logger())
  .use(swagger())
  .use(cors())
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_KEY!,
    })
  )
  .get("/", () => ({ message: "Hello World Conductor" }))
  .use(auth)
  .use(conductor)
  .use(managersRoute)
  .use(inspectorRoutes)
  .get("/userlogs/:tripId", async ({ params, jwt, bearer }) => {
    const user = await jwt.verify(bearer);

    if (!user) {
      return { error: "Unauthorized" };
    }

    const logs = await db.query.tripLogs.findMany({
      where: (table, { eq }) => eq(table.tripId, params.tripId),
    });

    return logs;
  })
  .listen({ port: 3002 });

console.log(`🦊 Server is running at http://localhost:${app.server?.port}`);
