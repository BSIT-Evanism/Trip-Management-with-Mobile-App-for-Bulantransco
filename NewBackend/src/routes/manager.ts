import Elysia, { t } from "elysia";
import db from "../db";
import jwt from "@elysiajs/jwt";
import { conductors, inspectors, locations, trips, trips } from "../db/schema";
import bearer from "@elysiajs/bearer";

export const managersRoute = new Elysia({ prefix: "/manager" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.SECRET_KEY!,
    })
  )
  .use(bearer())
  .get("/conductors", async () => {
    const conductors = await db.query.conductors.findMany({
      with: {
        relatedTrips: {
          columns: {
            isCompleted: true,
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
            isCompleted: true,
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
            name: body.email,
            password: body.password,
          })
          .returning();
        return conductor;
      } else if (body.role === "inspector") {
        const inspector = await db
          .insert(inspectors)
          .values({
            name: body.email,
            password: body.password,
          })
          .returning();
        return inspector;
      }
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
        }),
        password: t.String(),
        role: t.Union([t.Literal("conductor"), t.Literal("inspector")]),
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
  );
