import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { importJobsFromExternal } from "../services/externalJobsService.js";
import pkg from "pg";
import fs from "fs";

const { Client } = pkg;
const DB_NAME = process.env.DB_NAME
  

async function ensureDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: "postgres",  // Connect to default postgres DB first
  });

  await client.connect();

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DB_NAME]
  );

  if (result.rowCount === 0) {
    console.log(`Database ${DB_NAME} does not exist. Creating...`);
    await client.query(`CREATE DATABASE ${DB_NAME}`);
  } else {
    console.log(`Database ${DB_NAME} already exists.`);
  }

  await client.end();
}

async function ensureTables() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database:process.env.DB_NAME,
  });
  await client.connect();

  const sql = fs.readFileSync(path.resolve(__dirname, "db_setup.sql"), "utf8");
  await client.query(sql);

  console.log("Tables & enums ensured.");
  await client.end();
}

export async function runSetup() {
  await ensureDatabase();
  await ensureTables();
  try {
    await importJobsFromExternal();
  } catch (error) {
    console.warn('⚠️ External job import skipped:', error.message);
  }
}

