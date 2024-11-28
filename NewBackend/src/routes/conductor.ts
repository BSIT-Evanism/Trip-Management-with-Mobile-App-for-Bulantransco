import { Elysia, t } from "elysia";
import db from "../db/index.js";
import { location, locations } from "../db/schema.js";
import { eq, gt, sql } from "drizzle-orm";

export const conductor = new Elysia()
  .get("/destinations", async () => {
    try {
      const result = await db.select().from(location);
      return result;
    } catch (error) {
      throw new Error("Database error");
    }
  })
  .post(
    "/passengers",
    async ({ body }) => {
      const { destinationId } = body;
      try {
        const result = await db
          .update(locations)
          .set({ count: sql`${locations.count} + 1` })
          .where(eq(locations.id, destinationId))
          .returning();
        return result[0];
      } catch (error) {
        throw new Error("Database error");
      }
    },
    {
      body: t.Object({
        destinationId: t.Number(),
      }),
    }
  )
  .get("/departure-destinations", async () => {
    try {
      const result = await db
        .select()
        .from(locations)
        .where(gt(locations.count, 0));
      return result;
    } catch (error) {
      throw new Error("Database error");
    }
  })
  .post(
    "/deboard",
    async ({ body }) => {
      const { destinationId, multiplier } = body;

      if (multiplier <= 0) {
        throw new Error("Multiplier must be greater than zero.");
      }

      try {
        const destination = await db
          .select()
          .from(locations)
          .where(eq(locations.id, destinationId))
          .limit(1);

        if (!destination.length) {
          throw new Error("Destination not found.");
        }

        const currentCount = destination[0].count ?? 0;

        if (currentCount < multiplier) {
          throw new Error(
            `Cannot deboard ${multiplier} passengers. Only ${currentCount} are available.`
          );
        }

        await db
          .update(locations)
          .set({ count: Math.max(currentCount - multiplier, 0) })
          .where(eq(locations.id, destinationId));

        const updatedDestinations = await db
          .select()
          .from(locations)
          .where(gt(locations.count, 0));

        return {
          message: `Successfully deboarded ${multiplier} passenger(s)`,
          destinations: updatedDestinations,
        };
      } catch (error) {
        throw new Error("Database error");
      }
    },
    {
      body: t.Object({
        destinationId: t.Number(),
        multiplier: t.Number(),
      }),
    }
  );
