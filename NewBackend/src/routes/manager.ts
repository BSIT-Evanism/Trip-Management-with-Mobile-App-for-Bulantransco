import Elysia, { t } from "elysia";
import db from "../db";
import jwt from "@elysiajs/jwt";
import { conductors, locations } from "../db/schema";
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
  .post(
    "/addconductor",
    async ({ body, jwt, bearer }) => {
      console.log(body);
      console.log(bearer);

      const decoded = await jwt.verify(bearer);

      if (decoded && decoded.role !== "manager") {
        return new Error("Unauthorized");
      }

      const conductor = await db
        .insert(conductors)
        .values({
          name: body.email,
          password: body.password,
        })
        .returning();
      return conductor;
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
        }),
        password: t.String(),
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
  );
