import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import cookie from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { auth } from "./routes/auth";
import { conductor } from "./routes/conductor";
import { managersRoute } from "./routes/manager";
import { logger } from "@tqman/nice-logger";

const app = new Elysia()
  .use(logger())
  .use(swagger())
  .use(cors())
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.SECRET_KEY!,
    })
  )
  .get("/", () => ({ message: "Hello World Conductor" }))
  .use(auth)
  .use(conductor)
  .use(managersRoute)
  .listen(5002);

console.log(`🦊 Server is running at http://localhost:${app.server?.port}`);
