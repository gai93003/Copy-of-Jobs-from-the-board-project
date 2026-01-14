import express from "express";
import { authenticate } from "../Utils/authMiddleware.js";
import { pool } from "../DB/db.js";

const router = express.Router();

// Get comments for a specific job application
router.get("/job-comments/:applicationId", authenticate, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await pool.query(
      `SELECT 
        jc.comment_id,
        jc.comment_text,
        jc.created_at,
        jc.author_id,
        u.full_name as author_name,
        u.user_role as role
       FROM job_comments jc
       JOIN users u ON jc.author_id = u.user_id
       WHERE jc.application_id = $1
       ORDER BY jc.created_at ASC`,
      [applicationId]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    console.error("Error fetching job comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Post a comment on a job application
router.post("/job-comments", authenticate, async (req, res) => {
  try {
    const { applicationId, comment } = req.body;
    const authorId = req.user.user_id;

    if (!applicationId || !comment) {
      return res.status(400).json({ error: "applicationId and comment are required" });
    }

    // Verify the application exists and get trainee/mentor info
    const appCheck = await pool.query(
      `SELECT a.user_id as trainee_id, u.mentor_id 
       FROM applications a
       JOIN users u ON a.user_id = u.user_id
       WHERE a.application_id = $1`,
      [applicationId]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const { trainee_id, mentor_id } = appCheck.rows[0];

    // Verify that the author is either the trainee or their mentor
    if (authorId !== trainee_id && authorId !== mentor_id) {
      return res.status(403).json({ error: "You can only comment on your own applications or your mentee's applications" });
    }

    const result = await pool.query(
      `INSERT INTO job_comments (application_id, author_id, comment_text)
       VALUES ($1, $2, $3)
       RETURNING comment_id, comment_text, created_at, author_id`,
      [applicationId, authorId, comment]
    );

    // Get author details
    const authorResult = await pool.query(
      `SELECT full_name, user_role FROM users WHERE user_id = $1`,
      [authorId]
    );

    const newComment = {
      ...result.rows[0],
      author_name: authorResult.rows[0].full_name,
      role: authorResult.rows[0].user_role,
    };

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error posting job comment:", error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

export default router;
