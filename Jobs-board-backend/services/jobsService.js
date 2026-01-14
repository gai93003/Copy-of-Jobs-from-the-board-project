import { pool } from '../DB/db.js'; // required for database version

export async function findJobByExternalId(external_job_id, source) {
  const result = await pool.query(
    'SELECT job_id FROM jobs WHERE external_job_id = $1 AND source = $2',
    [external_job_id, source]
  );
  return result.rows[0] || null;
}


// list all jobs from the database, with optional filters
export async function getAllJobs({
  location,
  employment_type,
  company,
  approved,
  userId,
  tech_stack,
  exp_level,
  location_type,
  api_source,
  star_companies
} = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (location) {
    conditions.push(`j.location ILIKE $${idx++}`);
    values.push(`%${location}%`);
  }

  if (location_type) {
  const normalizedLocationType = location_type.trim().toLowerCase();
  conditions.push(`LOWER(j.location_type) = $${idx++}`);
  values.push(normalizedLocationType);
  }

  if (employment_type) {
    conditions.push(`j.employment_type = $${idx++}`);
    values.push(employment_type);
  }

  if (company) {
    conditions.push(`j.company ILIKE $${idx++}`);
    values.push(`%${company}%`);
  }

  if (exp_level) {
    const cleanLevel = exp_level.trim();
    conditions.push(`j.exp_level = $${idx++}`);
    values.push(cleanLevel);
  }

  if (tech_stack) {
    const cleanTech = tech_stack.trim();
    conditions.push(`j.tech_stack ILIKE $${idx++}`);
    values.push(`%${cleanTech}%`);
  }

  if (approved !== undefined) {
    if (approved === true) conditions.push(`j.approved_at IS NOT NULL`);
    else conditions.push(`j.approved_at IS NULL`);
  }

  if (api_source) {
    conditions.push(`j.api_source = $${idx++}`);
    values.push(api_source);
  }
  
  if (star_companies === 'true') {
  conditions.push('sc.company_name IS NOT NULL');
  }


// Left join applications filtered to the provided userId
const userJoin = userId
  ? `LEFT JOIN applications a ON a.job_id = j.job_id AND a.user_id = $${idx++}`
  : `LEFT JOIN applications a ON a.job_id = j.job_id AND false`;

  if (userId) values.push(userId);

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // ✅ ✅ ONLY ADDITION: LEFT JOIN star_companies + is_star FIELD
  const query = `
    SELECT 
      j.*, 
      a.application_id, 
      a.status as application_status,

      -- ⭐ STAR COMPANY CHECK (ADDED)
      CASE 
        WHEN sc.company_name IS NOT NULL THEN true 
        ELSE false 
      END AS is_star

    FROM jobs j

    ${userJoin}

    -- ⭐ STAR TABLE JOIN (ADDED)
    LEFT JOIN star_companies sc
      ON TRIM(LOWER(sc.company_name)) = TRIM(LOWER(j.company))

    ${whereClause}
    ORDER BY j.job_id DESC
  `;
  console.log('QUERY:', query);
  console.log('VALUES', values);

  const result = await pool.query(query, values);
  return result.rows;
}

// finding one job by its ID from the database
export async function getJobById(id) {
  const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
  return result.rows[0];
}

// created a new job in the database
export async function createJob(jobData) {
  const {
    title, company, location, employment_type, tech_stack,
    source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from, location_type, salary_min, salary_max
  } = jobData;

  const result = await pool.query(
    `INSERT INTO jobs (
      title, company, location, employment_type, tech_stack,
      source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from, location_type, salary_min, salary_max
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [title, company, location, employment_type, tech_stack,
     source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from,location_type, salary_min,salary_max]
  );
  return result.rows[0];
}


export default {
  getAllJobs,
  getJobById,
  createJob,
  findJobByExternalId
};
