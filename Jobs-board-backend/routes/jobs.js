import express from 'express';
import { getAllJobs, getJobById, createJob } from 
'../services/jobsService.js';
import { isValidUrl } from '../Utils/Check.js';
import { importJobsFromExternal } from '../services/externalJobsService.js';
import { authenticate } from '../Utils/authMiddleware.js';

const router = express.Router();

router.get('/test', (req, res) => { res.send('Test route works'); });

// Lists all jobs
// router.get('/all',authenticate, async (req, res) => {
  router.get('/all', async(req, res) =>{
  try {
    const approved =
      req.query.approved === undefined
        ? undefined
        : req.query.approved === 'true';

    const jobs = await getAllJobs({
      location: req.query.location,
      employment_type: req.query.employment_type,
      company: req.query.company,
      approved,
      userId: req.query.userId || req.query.user_id, // This is to forward userId query param to the service
      tech_stack: req.query.tech_stack, // adding filtering tech stack
      exp_level: req.query.exp_level, // adding filtering for experience level
      //new
      location_type: req.query.location_type,
      api_source: req.query.api_source,
      star_companies: req.query.star_companies 
    });

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs
    });
  } catch (err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});



// Views one job by ID
router.get('/:id',authenticate, async (req, res) => {
  try {
    const job = await getJobById(parseInt(req.params.id, 10));
    if (job) {
      return res.status(200).json({ message: "Job fetched successfuly", job }); // Object wrapped
    } else {
      res.status(404).json({
        error: "JobNotFound",
        message: `Job with id ${req.params.id} does not exist.`
      });
    }
  } catch (err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});

const ALLOWED_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance"
];

router.post('/', async (req, res) => {
  const { title, company, apply_url, employment_type, tech_stack, expLevel } = req.body;

  // Required fields
  if (!title) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'title' is required." });
  }
  if (!company) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'company' is required." });
  }
  if (!apply_url) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'apply_url' is required." });
  }
  // Validate URL
  if (!isValidUrl(apply_url)) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'apply_url' must be a valid URL." });
  }
  // Validate employment_type
  if (employment_type && !ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({
      error: "ValidationError",
      message: `Field 'employment_type' must be one of: ${ALLOWED_EMPLOYMENT_TYPES.join(', ')}.`
    });
  }

 //permission logic for admin approval 
 const userRole = req.header ("x-user-role");
 const isAdmin = userRole === 'admin';
 const {approved_at, ...rest} = req.body;
 const jobData = isAdmin
  ?{ ...rest, approved_at}
  : { ...rest, approved_at:null};
 
  // if validation passes it Creates a new job
  try {
    const job = await createJob(jobData); // Assumes createJob is defined and async
    res.status(201).json({message: "Job created successfully",job});
  } catch(err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});

// Imports jobs from external API into our database
router.post('/import', async (req, res) => {
  try {
    await importJobsFromExternal();
    res.status(201).json({ message: "Imported jobs from external API" });
  } catch (err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});

export default router;
