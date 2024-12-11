import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import db from "../db";
import { locations, trips } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { addLogsAction } from "../lib/add-logs";

export const inspectorRoutes = new Elysia({ prefix: "/inspector" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_KEY!,
    })
  )
  .use(bearer())
  .get("/trips", async ({ jwt, bearer, query }) => {
    if (!bearer) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await jwt.verify(bearer);

    if (!user || user.role !== "inspector") {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      if (query.tripId) {
        const trips = await db.query.trips.findMany({
          where: (table, { eq, and }) =>
            and(
              eq(table.inspectorId, user.userId as string),
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
            eq(table.inspectorId, user.userId as string),
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
    } catch (e) {
      throw new Error("Error Fetching Trips");
    }
  })
  .post(
    "/start-trip",
    async ({ jwt, bearer, body }) => {
      if (!bearer) {
        return new Response("Unauthorized", { status: 401 });
      }

      const user = await jwt.verify(bearer);

      if (!user || user.role !== "conductor") {
        return new Response("Unauthorized", { status: 401 });
      }

      try {
        const trip = await db.transaction(async (tx) => {
          // const trip = await tx
          //   .select()
          //   .from(trips)
          //   .where(
          //     and(
          //       eq(trips.inspectorId, user.userId as string),
          //       eq(trips.id, body.tripId)
          //     )
          //   )
          //   .leftJoin(locations, eq(trips.destination, locations.id));

          const tripQuery = await tx.query.trips.findFirst({
            where: (table, { eq, and }) =>
              and(
                eq(table.conductorId, user.userId as string),
                eq(table.id, body.tripId)
              ),
            with: {
              relatedDestination: {
                columns: {
                  id: true,
                },
              },
            },
          });

          if (!tripQuery) {
            throw new Error("Trip Not Found");
          }

          const updatedTrip = await tx
            .update(trips)
            .set({
              tripStatus: "in_progress",
              startDate: new Date(),
            })
            .where(eq(trips.id, body.tripId));

          await addLogsAction(
            body.tripId,
            `Trip Started by Conductor ${user.userId}`
          );

          return updatedTrip;
        });

        return trip;
      } catch (e) {
        throw new Error("Error Starting Trip");
      }
    },
    {
      body: t.Object({
        tripId: t.String(),
      }),
    }
  )
  .post(
    "/end-trip",
    async ({ jwt, bearer, body }) => {
      if (!bearer) {
        return new Response("Unauthorized", { status: 401 });
      }

      const user = await jwt.verify(bearer);

      if (!user || user.role !== "conductor") {
        return new Response("Unauthorized", { status: 401 });
      }

      try {
        const trip = await db.transaction(async (tx) => {
          // const trip = await tx
          //   .select()
          //   .from(trips)
          //   .where(
          //     and(
          //       eq(trips.inspectorId, user.userId as string),
          //       eq(trips.id, body.tripId),
          //       eq(trips.tripStatus, "in_progress")
          //     )
          //   )

          const trip = await tx.query.trips.findFirst({
            where: (table, { eq, and }) =>
              and(
                eq(table.conductorId, user.userId as string),
                eq(table.id, body.tripId),
                eq(table.tripStatus, "in_progress")
              ),
            with: {
              relatedDestination: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          });

          if (!trip) {
            throw new Error("Trip Not Found");
          }

          const updatedTrip = await tx
            .update(trips)
            .set({
              tripStatus: "completed",
              endDate: new Date(),
            })
            .where(eq(trips.id, body.tripId));

          await addLogsAction(
            body.tripId,
            `Trip Ended by Conductor ${user.userId} on Location ${trip.relatedDestination?.name}`
          );

          return updatedTrip;
        });

        return trip;
      } catch (e) {
        throw new Error("Error Ending Trip");
      }
    },
    {
      body: t.Object({
        tripId: t.String(),
      }),
    }
  );
