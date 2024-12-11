import db from "../db";
import { tripLogs } from "../db/schema";

export const addLogsAction = async (
  tripId: string,
  log: string,
  dbInstance = db
) => {
  try {
    await dbInstance.insert(tripLogs).values({
      tripId,
      logMessage: log,
      logTime: new Date(),
    });
  } catch (error) {
    throw new Error("Failed to add logs");
  }
};
