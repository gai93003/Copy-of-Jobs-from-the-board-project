import cron from "node-cron";
import { fetchAndStoreSlackJobs } from "../services/slackJobService.js";

// Runs every day at 02:00 AM
cron.schedule("* * * * *", async () => {
  console.log("⏳ Running daily Slack job import...");
  await fetchAndStoreSlackJobs();
});
