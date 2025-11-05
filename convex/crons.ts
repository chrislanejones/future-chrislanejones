// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 02:00 UTC on the 1st of every month
crons.monthly(
  "refresh-browserLink-screenshots",
  { day: 1, hourUTC: 2, minuteUTC: 0 },
  internal.browserLinks.refreshAllScreenshotsInternal
);

export default crons;
