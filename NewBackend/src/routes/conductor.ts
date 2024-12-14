import { Elysia, t } from "elysia";
import db from "../db/index.js";
import { locations, tripCountRequests, trips } from "../db/schema.js";
import { eq, gt, sql } from "drizzle-orm";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { addLogsAction } from "../lib/add-logs.js";

export const conductor = new Elysia({ prefix: "/conductor" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_KEY!,
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
  )
  .get(
    '/requests/:tripId',
    async ({ jwt, bearer, params }) => {
      const payload = await jwt.verify(bearer);

      if (!payload) {
        throw new Error("Unauthorized");
      }

      const requests = await db.query.tripCountRequests.findMany({
        where: (table, { eq }) => eq(table.tripId, params.tripId as string),
      });

      return requests;
    }
  )
  .post(
    "/change-count",
    async ({ body, jwt, bearer }) => {
      console.log(body);

      const { type, count, tripId } = body;

      const payload = await jwt.verify(bearer);

      if (!payload) {
        throw new Error("Unauthorized");
      }

      if (payload.role !== "conductor") {
        throw new Error("Unauthorized");
      }

      const pendingRequests = await db.query.tripCountRequests.findMany({
        where: (table, { eq }) => eq(table.tripId, tripId),
      });

      if (pendingRequests.some(request => request.requestStatus === "pending")) {
        throw new Error("Pending request already exists");
      }

      const trip = await db.query.trips.findFirst({
        where: (table, { eq }) => eq(table.id, tripId),
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (type === "add") {
        // const result = await db
        //   .update(trips)
        //   .set({
        //     currentPassengers: sql`${trips.currentPassengers} + ${count}`,
        //   })
        //   .where(eq(trips.id, tripId))
        //   .returning({
        //     currentPassengers: trips.currentPassengers,
        //   });
        
        const result = await db
          .insert(tripCountRequests)
          .values({
            tripId: tripId,
            requestValue: trip.currentPassengers + count,
            requestStatus: "pending",
          })
          .returning();

        await addLogsAction(
          tripId,
          `Conductor requested to add ${count} passengers`
        );

        return result[0];
      } else if (type === "sub") {
        // const result = await db
        //   .update(trips)
        //   .set({
        //     currentPassengers: sql`${trips.currentPassengers} - ${count}`,
        //   })
        //   .where(eq(trips.id, tripId))
        //   .returning({
        //     currentPassengers: trips.currentPassengers,
        //   });

        const result = await db
          .insert(tripCountRequests)
          .values({
            tripId: tripId,
            requestValue: trip.currentPassengers - count,
            requestStatus: "pending",
          })
          .returning();

        await addLogsAction(
          tripId,
          `Conductor requested to remove ${count} passengers`
        );

        return result[0];
      }
    },
    {
      body: t.Object({
        type: t.Union([t.Literal("add"), t.Literal("sub")]),
        count: t.Number(),
        tripId: t.String(),
      }),
    }
  );
