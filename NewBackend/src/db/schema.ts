import { pgTable } from "drizzle-orm/pg-core";

export const ticket = pgTable("ticket", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  passengerId: t.integer().references(() => passengers.id),
  tripId: t.integer().references(() => trips.id),
  locationId: t.integer().references(() => locations.id),
}));

export const location = pgTable("location", (t) => ({
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

export const inspectionPoints = pgTable("inspection_points", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
}));

export const assignments = pgTable("assignments", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  locationId: t.uuid().references(() => location.id),
  inspectorId: t.uuid().references(() => inspectors.id),
  conductorId: t.uuid().references(() => conductors.id),
  inspectionPointId: t.uuid().references(() => inspectionPoints.id),
}));

export const trips = pgTable("trips", (t) => ({
  id: t.serial("id").primaryKey(),
  conductorId: t.uuid("conductor_id").references(() => conductors.id),
  startDate: t.timestamp("start_date").notNull(),
  endDate: t.timestamp("end_date").notNull(),
  isCompleted: t.boolean("is_completed").notNull().default(false),
}));

export const locations = pgTable("locations", (t) => ({
  id: t.serial("id").primaryKey(),
  locationId: t.uuid("location_id").references(() => location.id),
  passengerCount: t.integer("passenger_count").notNull(),
  tripId: t.integer("trip_id").references(() => trips.id),
  name: t.varchar("name", { length: 255 }),
  count: t.integer("count"),
}));

export const tripLogs = pgTable("trip_logs", (t) => ({
  id: t.serial("id").primaryKey(),
  tripId: t.integer("trip_id").references(() => trips.id),
  locationId: t.integer("location_id").references(() => locations.id),
  logMessage: t.varchar("log_message", { length: 255 }),
  logTime: t.timestamp("log_time").notNull(),
}));

export const passengers = pgTable("passengers", (t) => ({
  id: t.serial("id").primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
  destination: t.varchar("destination", { length: 255 }),
  logTime: t.timestamp("log_time").notNull(),
}));
