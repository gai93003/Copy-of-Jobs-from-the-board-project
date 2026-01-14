import express from 'express';
import {
  createApplication,
  updateApplicationStatus,
  getApplicationsByUser,
  getApplicationByUserAndJob
} from '../services/applicationsService.js';
import { authenticate } from "../Utils/authMiddleware.js";
import { pool } from '../DB/db.js';

const router = express.Router();

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const { user_id, job_id, status } = req.body;
    
    if (!user_id || !job_id) {
      return res.status(400).json({ error: 'user_id and job_id required' });
    }
    
    const app = await createApplication({ user_id, job_id, status });
    res.status(201).json({ application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    const updated = await updateApplicationStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Application not found' });
    res.json({ application: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications?userId=...
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId || req.query.user_id, 10);
    if (!userId) return res.status(400).json({ error: 'userId query param required' });
    const apps = await getApplicationsByUser(userId);
    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/by?userId=&jobId=
router.get('/by', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId, 10);
    const jobId = parseInt(req.query.jobId, 10);
    if (!userId || !jobId) return res.status(400).json({ error: 'userId & jobId required' });
    const app = await getApplicationByUserAndJob(userId, jobId);
    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const result = await pool.query(
      `DELETE FROM applications
       WHERE application_id = $1 AND user_id = $2
       RETURNING application_id`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.json({ ok: true, deletedId: result.rows[0].application_id });
  } catch (err) {
    console.error("Delete application error:", err);
    return res.status(500).json({ error: "Server error deleting application" });
  }
});

export default router;