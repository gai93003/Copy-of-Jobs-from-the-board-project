import express from "express";
import { pool } from "../DB/db.js";
import { authenticate, requireRole } from "../Utils/authMiddleware.js";


const router = express.Router();

// STAR A COMPANY (STAFF ONLY)
router.post("/star-company", authenticate, requireRole("Staff"), async (req, res) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const result = await pool.query(
      `INSERT INTO star_companies (company_name)
       VALUES ($1)
       ON CONFLICT (company_name) DO NOTHING
       RETURNING *`,
      [company]
    );

    res.json({
      message: `${company} is now a ⭐ star company`,
      star_company: result.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UNSTAR A COMPANY 
router.delete("/star-company/:company",authenticate, requireRole("Staff"), async (req, res) => {
  try {
    const { company } = req.params;

    await pool.query(
      `DELETE FROM star_companies WHERE company_name = $1`,
      [company]
    );

    res.json({ message: `${company} is no longer a star company` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/cohort/funnel", authenticate, requireRole("Staff") ,async (req, res) => {
  const result = await pool.query(`
    SELECT status, COUNT(*)::int AS total
    FROM applications a
    JOIN users u ON u.user_id = a.user_id
    WHERE u.user_role = 'Trainee'
    GROUP BY status
  `);

  const stats = {
    "Application Submitted": 0,
    "Initial Screening": 0,
    "1st Round Interview": 0,
    "2nd Round Interview": 0,
    "Application Declined": 0,
    "Offer Received": 0
  };

  result.rows.forEach(row => {
    if (stats[row.status] !== undefined) {
      stats[row.status] = row.total;
    }
  });

  res.json({
    cohort: "Launch Module Nov25",
    stats
  });
});

router.get("/cohort/trainees", authenticate,requireRole("Staff") ,async (req, res) => {
  const result = await pool.query(`
    SELECT 
      u.user_id,
      u.full_name,
      a.status,
      COUNT(*)::int AS total
    FROM users u
    LEFT JOIN applications a ON a.user_id = u.user_id
    WHERE u.user_role = 'Trainee'
    GROUP BY u.user_id, u.full_name, a.status
    ORDER BY u.full_name
  `);

  res.json({ rows: result.rows });
  console.log(res.json({ rows: result.rows }))
});










export default router;
