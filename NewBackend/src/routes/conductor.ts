import { Elysia, t } from "elysia";
import db from "../db/index.js";
import { locations } from "../db/schema.js";
import { eq, gt, sql } from "drizzle-orm";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";

export const conductor = new Elysia({ prefix: "/conductor" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.SECRET_KEY!,
    })
  )
  .use(bearer())
  .get(
    "/trips",
    async ({ jwt, bearer, query }) => {
      const payload = await jwt.verify(bearer);

      if (!payload) {
        throw new Error("Unauthorized");
      }

      if (payload.role !== "conductor") {
        throw new Error("Unauthorized");
      }

      if (query.tripId) {
        console.log("query exists", query.tripId);

        const trips = await db.query.trips.findMany({
          where: (table, { eq, and }) =>
            and(
              eq(table.conductorId, payload.userId as string),
              eq(table.id, query.tripId as string)
            ),
          with: {
            relatedDestination: {
              columns: {
                name: true,
              },
            },
            relatedInspector: {
              columns: {
                name: true,
              },
            },
          },
        });
        return trips;
      } else {
        const trips = await db.query.trips.findMany({
          where: (table, { eq }) =>
            eq(table.conductorId, payload.userId as string),
          with: {
            relatedDestination: {
              columns: {
                name: true,
              },
            },
            relatedInspector: {
              columns: {
                name: true,
              },
            },
          },
        });
        return trips;
      }
    },
    {
      beforeHandle: async ({ bearer, jwt }) => {
        if (!bearer) {
          throw new Error("Unauthorized");
        }
      },
    }
  );
