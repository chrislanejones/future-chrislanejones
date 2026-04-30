import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup stale SEO entries",
  { hourUTC: 3, minuteUTC: 0 },
  internal.seo.cleanupStaleSEO,
);

export default crons;
