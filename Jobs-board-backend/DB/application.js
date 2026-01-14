import { pool } from './db.js';

export async function createOrUpdateApplication(user_id, job_id, status = 'Application Started') {
  const result = await pool.query(
    `INSERT INTO applications (user_id, job_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, job_id)
     DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [user_id, job_id, status]
  );
  return result.rows[0];
}

export async function updateApplicationStatus(application_id, status) {
  const result = await pool.query(
    `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE application_id = $2 RETURNING *`,
    [status, application_id]
  );
  return result.rows[0];
}

export async function getApplicationsByUser(user_id) {
  // const r = await pool.query('SELECT * FROM applications WHERE user_id = $1 ORDER BY updated_at DESC', [user_id]);
  const r = await pool.query(
    `SELECT 
        a.application_id,
        a.user_id,
        a.job_id,
        a.status,
        a.created_at,
        a.updated_at,
        j.title,
        j.company,
        j.location,
        j.employment_type,
        j.exp_level,
        j.partner_name,
        j.apply_url,
        j.active_from
     FROM applications a
     JOIN jobs j ON j.job_id = a.job_id
     WHERE a.user_id = $1
     ORDER BY a.updated_at DESC`,
    [user_id]
  );
  return r.rows;
}

export async function getApplicationByUserAndJob(user_id, job_id) {
  const r = await pool.query('SELECT * FROM applications WHERE user_id = $1 AND job_id = $2', [user_id, job_id]);
  return r.rows[0];
}

export async function getApplicationById(application_id) {
  const r = await pool.query('SELECT * FROM applications WHERE application_id = $1', [application_id]);
  return r.rows[0];
}

export default {
  createOrUpdateApplication,
  updateApplicationStatus,
  getApplicationsByUser,
  getApplicationByUserAndJob,
  getApplicationById,
};