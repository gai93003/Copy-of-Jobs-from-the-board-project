import express from "express";
import cors from "cors";

import jobsRouter from "./routes/jobs.js";
import userRouter from "./routes/users.js";
import applicationsRouter from "./routes/applications.js";
import staffRoutes from "./routes/staff.js";
import "./services/slackCron.js";
import { fetchAndStoreSlackJobs } from "./services/slackJobService.js";
import commentsRouter from "./routes/comments.js";
import { deleteOldJobs } from "./services/deleteOldJobs.js";


import { runSetup } from "./DB/migrations.js";
import {setupCronJobs } from "./services/CronSchedule.js";

console.log("✅✅✅ NEW CORS VERSION IS RUNNING ✅✅✅");


const app = express();
const port = process.env.PORT ||5501;


// Allow both production and local development origins
const allowedOrigins = [
  "https://careerflow.hosting.codeyourfuture.io",
  "http://localhost:5173",
  "http://localhost:5174"
];

// ✅ CORS with dynamic origin checking
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ SAFE PREFLIGHT HANDLER
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (req.method === "OPTIONS") {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
      return res.sendStatus(204);
    }
  }
  next();
});



app.use(express.json());

await runSetup();
// In development, clean out old jobs once on startup
if (process.env.NODE_ENV === "development") { // it should be switched to production so that if condtion is false and deleteOldJobs() was skipped, then only cron job does cleanup.
  await deleteOldJobs();
  console.log("[STARTUP] Ran deleteOldJobs once in development");
}

app.use('/api/jobs', jobsRouter);
app.use("/api", userRouter);
app.use("/api/staff", staffRoutes);
app.use('/api/applications', applicationsRouter)
app.use('/api', commentsRouter);



app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  setupCronJobs();
});

