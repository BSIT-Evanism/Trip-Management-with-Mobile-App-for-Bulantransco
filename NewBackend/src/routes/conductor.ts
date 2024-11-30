import { Elysia, t } from "elysia";
import db from "../db/index.js";
import { locations } from "../db/schema.js";
import { eq, gt, sql } from "drizzle-orm";
import jwt from "@elysiajs/jwt";

export const conductor = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.SECRET_KEY!,
    })
  )
  .get("/trips", async ({ jwt }) => {
    const trips = await db.query.trips.findMany({
      with: {
        locations: true,
      },
    });
    return trips;
  });
