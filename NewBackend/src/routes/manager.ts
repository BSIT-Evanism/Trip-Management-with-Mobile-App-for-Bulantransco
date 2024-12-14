import Elysia, { t } from "elysia";
import db from "../db";
import jwt from "@elysiajs/jwt";
import { conductors, inspectors, locations, trips } from "../db/schema";
import bearer from "@elysiajs/bearer";
import { eq } from "drizzle-orm";

export const managersRoute = new Elysia({ prefix: "/manager" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_KEY!,
    })
  )
  .use(bearer())
  .get("/conductors", async () => {
    const conductors = await db.query.conductors.findMany({
      with: {
        relatedTrips: {
          columns: {
            tripStatus: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
      },
    });
    console.log(conductors);
    return conductors;
  })
  .get("/locations", async () => {
    const locations = await db.query.locations.findMany();
    return locations;
  })
  .get("/inspectors", async () => {
    const inspectors = await db.query.inspectors.findMany({
      with: {
        relatedTrips: {
          columns: {
            tripStatus: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
      },
    });
    return inspectors;
  })
  .post(
    "/addpersonel",
    async ({ body, jwt, bearer }) => {
      console.log(body);
      console.log(bearer);

      const decoded = await jwt.verify(bearer);

      if (decoded && decoded.role !== "manager") {
        return new Error("Unauthorized");
      }

      if (body.role === "conductor") {
        const conductor = await db
          .insert(conductors)
          .values({
            name: body.name,
            password: body.password,
          })
          .returning();
        return conductor;
      } else if (body.role === "inspector") {
        const inspector = await db
          .insert(inspectors)
          .values({
            name: body.name,
            password: body.password,
          })
          .returning();
        return inspector;
      }
    },
    {
      body: t.Object({
        name: t.String(),
        password: t.String(),
        role: t.Union([t.Literal("conductor"), t.Literal("inspector")]),
      }),
    }
  )
  .post(
    "/deletepersonel",
    async ({ body, bearer, jwt }) => {
      console.log(body);

      const decoded = await jwt.verify(bearer);

      if (decoded && decoded.role !== "manager") {
        return new Error("Unauthorized");
      }

      if (body.type === "conductor") {
        const user = await db
          .delete(conductors)
          .where(eq(conductors.id, body.userId));
        return user;
      } else if (body.type === "inspector") {
        const user = await db
          .delete(inspectors)
          .where(eq(inspectors.id, body.userId));
        return user;
      }
    },
    {
      body: t.Object({
        userId: t.String(),
        type: t.Union([t.Literal("conductor"), t.Literal("inspector")]),
      }),
    }
  )
  .post(
    "/addlocation",
    async ({ body, bearer, jwt }) => {
      try {
        const decoded = await jwt.verify(bearer);

        if (decoded && decoded.role !== "manager") {
          return new Error("Unauthorized");
        }

        const location = await db.insert(locations).values(body).returning();
        return location;
      } catch (error) {
        return new Error("Failed to add location");
      }
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .post(
    "/addtrips",
    async ({ body, bearer, jwt }) => {
      const decoded = await jwt.verify(bearer);

      if (decoded && decoded.role !== "manager") {
        return new Error("Unauthorized");
      }

      const newTrips = await db
        .insert(trips)
        .values({
          destination: body.locationId,
          conductorId: body.conductorId,
          inspectorId: body.inspectorId,
          startDate: body.date,
          endDate: body.date,
          totalPassengers: body.totalPassengers,
          currentPassengers: body.totalPassengers,
        })
        .returning();

      return newTrips;
    },
    {
      body: t.Object({
        locationId: t.String(),
        conductorId: t.String(),
        inspectorId: t.String(),
        date: t.Date(),
        totalPassengers: t.Number(),
      }),
    }
  )
  .post(
    "/deletelocation",
    async ({ body, bearer, jwt }) => {
      const decoded = await jwt.verify(bearer);

      if (decoded && decoded.role !== "manager") {
        return new Error("Unauthorized");
      }

      const location = await db
        .delete(locations)
        .where(eq(locations.id, body.id));

      return location;
    },
    {
      body: t.Object({
        id: t.String(),
      }),
    }
  )
  .get("/trips", async () => {
    const trips = await db.query.trips.findMany({
      with: {
        relatedConductor: {
          columns: {
            name: true,
          },
        },
        relatedInspector: {
          columns: {
            name: true,
          },
        },
        relatedDestination: {
          columns: {
            name: true,
          },
        },
      },
    });
    return trips;
  });
