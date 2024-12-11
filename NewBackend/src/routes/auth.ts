import { Elysia, t } from "elysia";
import db from "../db/index";
import { conductors, inspectors } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { jwt } from "@elysiajs/jwt";

enum Role {
  CONDUCTOR = "conductor",
  MANAGER = "manager",
  INSPECTOR = "inspector",
}

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_KEY!,
    })
  )
  .get("/", () => ({ message: "Hello World Auth" }))
  .post(
    "/login",
    async ({ jwt, body }) => {
      const { username, password, role } = body;

      if (role === "conductor") {
        const conductor = await db
          .select()
          .from(conductors)
          .where(
            and(
              eq(conductors.name, username),
              eq(conductors.password, password)
            )
          )
          .limit(1);

        if (conductor.length !== 0) {
          const token = await jwt.sign({
            userId: conductor[0].id,
            role: "conductor",
          });
          return { token };
        }
      } else if (role === "manager") {
        if (
          process.env.MANAGER_USER_NAME === username &&
          process.env.MANAGER_USER_PASSWORD === password
        ) {
          const token = await jwt.sign({ role: "manager" });
          return { token };
        }
      } else if (role === "inspector") {
        const inspector = await db
          .select()
          .from(inspectors)
          .where(
            and(
              eq(inspectors.name, username),
              eq(inspectors.password, password)
            )
          )
          .limit(1);

        if (inspector.length !== 0) {
          const token = await jwt.sign({
            userId: inspector[0].id,
            role: "inspector",
          });
          return { token };
        }
      }

      throw new Error("Invalid credentials or role");
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        role: t.Union([
          t.Literal("conductor"),
          t.Literal("manager"),
          t.Literal("inspector"),
        ]),
      }),
    }
  )
  .get(
    "/verify",
    async ({ jwt, query }) => {
      try {
        const payload = await jwt.verify(query.token);

        if (payload) {
          return { valid: true, role: payload.role };
        }
      } catch {
        throw new Error("Invalid token");
      }
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    }
  );
