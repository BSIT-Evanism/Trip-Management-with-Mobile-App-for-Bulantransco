import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const locations = pgTable("locations", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
}));

export const inspectors = pgTable("inspectors", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
  password: t.varchar("password", { length: 255 }).notNull(),
}));

export const conductors = pgTable("conductors", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
  password: t.varchar("password", { length: 255 }).notNull(),
}));

export const trips = pgTable("trips", (t) => ({
  id: t.uuid("id").defaultRandom().primaryKey(),
  conductorId: t.uuid("conductor_id").references(() => conductors.id),
  inspectorId: t.uuid("inspector_id").references(() => inspectors.id),
  startDate: t.timestamp("start_date").notNull(),
  endDate: t.timestamp("end_date").notNull(),
  isCompleted: t.boolean("is_completed").notNull().default(false),
  totalPassengers: t.integer("total_passengers").notNull(),
  currentPassengers: t.integer("current_passengers").notNull(),
  destination: t.uuid("destination").references(() => locations.id),
}));

export const tripLogs = pgTable("trip_logs", (t) => ({
  id: t.serial("id").primaryKey(),
  tripId: t.uuid("trip_id").references(() => trips.id),
  locationId: t.uuid("location_id").references(() => locations.id),
  logMessage: t.varchar("log_message", { length: 255 }),
  logTime: t.timestamp("log_time").notNull(),
}));

export const conductorsRelations = relations(conductors, ({ many }) => ({
  relatedTrips: many(trips),
}));

export const inspectorsRelations = relations(inspectors, ({ many }) => ({
  relatedTrips: many(trips),
}));

export const tripsRelations = relations(trips, ({ many, one }) => ({
  relatedDestination: one(locations, {
    fields: [trips.destination],
    references: [locations.id],
  }),
  relatedConductor: one(conductors, {
    fields: [trips.conductorId],
    references: [conductors.id],
  }),
  relatedTripLogs: many(tripLogs),
  relatedInspector: one(inspectors, {
    fields: [trips.inspectorId],
    references: [inspectors.id],
  }),
}));

export const tripLogsRelations = relations(tripLogs, ({ one }) => ({
  relatedTrip: one(trips, {
    fields: [tripLogs.tripId],
    references: [trips.id],
  }),
  relatedLocation: one(locations, {
    fields: [tripLogs.locationId],
    references: [locations.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  relatedTrips: many(trips),
  relatedTripLogs: many(tripLogs),
}));
