import { pool } from '../DB/db.js';
export async function deleteOldJobs() { // replaced created_at by active_from to match the Job age it removes jobs which are older than 30 days
  const query = `
    DELETE FROM jobs
    WHERE active_from < CURRENT_DATE - INTERVAL '30 days'
  `;
  const result = await pool.query(query);
  console.log('[CRON] Deleted old jobs:', result.rowCount);
}
