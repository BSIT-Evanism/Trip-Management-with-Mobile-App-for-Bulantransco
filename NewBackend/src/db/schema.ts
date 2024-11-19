import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const location = pgTable("location", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const inspectors = pgTable("inspectors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const conductors = pgTable("conductors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const inspectionPoints = pgTable("inspection_points", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => location.id),
  inspectorId: integer("inspector_id").references(() => inspectors.id),
  conductorId: integer("conductor_id").references(() => conductors.id),
  inspectionPointId: integer("inspection_point_id").references(
    () => inspectionPoints.id
  ),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  conductorId: integer("conductor_id").references(() => conductors.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => location.id),
  passengerCount: integer("passenger_count").notNull(),
  tripId: integer("trip_id").references(() => trips.id),
  name: varchar("name", { length: 255 }),
  count: integer("count"),
});

export const tripLogs = pgTable("trip_logs", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").references(() => trips.id),
  locationId: integer("location_id").references(() => locations.id),
  logMessage: varchar("log_message", { length: 255 }),
  logTime: timestamp("log_time").notNull(),
});

export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }),
  logTime: timestamp("log_time").notNull(),
});
