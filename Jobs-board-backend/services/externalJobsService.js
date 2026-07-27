import { createJob, findJobByExternalId } from './jobsService.js';

// External API configuration
const EXTERNAL_API_URL = 'https://devitjobs.uk/api/jobsLight';
const DEVITJOBS_BASE_URL = 'https://devitjobs.uk/job/';

// Allowed experience levels for import
const ALLOWED_EXP_LEVELS = ['junior', 'entry level', 'entry-level', 'graduate', 'regular'];

function mapEmploymentType(externalType) {
  switch (externalType) {
    case 'Full-Time':
    case 'Full time':
    case 'full-time':
      return 'Full-time';
    case 'Part-Time':
    case 'Part time':
    case 'part-time':
      return 'Part-time';
    case 'Contract':
      return 'Contract';
    case 'Internship':
      return 'Internship';
    case 'Freelance':
      return 'Freelance';
    default:
      return 'Full-time';
  }
}

export async function importJobsFromExternal(apiUrl = EXTERNAL_API_URL, baseJobUrl = DEVITJOBS_BASE_URL) {
  const response = await fetch(apiUrl, {
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0 (compatible; JobsBoardBot/1.0)',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch jobs');
  const externalJobs = await response.json();

  for (const externalJob of externalJobs) {
    // Filter: only import junior/entry-level jobs
    const expLevel = (externalJob.expLevel || '').toLowerCase();
    const isJuniorLevel = ALLOWED_EXP_LEVELS.some(level => expLevel.includes(level));
    if (!isJuniorLevel) {
      continue; // skip non-junior jobs
    }

    // Gets unique external job ID
    const externalId = externalJob.id || externalJob.jobId || externalJob.jobUrl;

    // Skips if job already exists (using external ID, not URL)
    const existing = await findJobByExternalId(externalId, 'DevITJobs');
    if (existing) {
      continue;
    }

    // Builds apply URL with fallback
    const applyUrl =
      externalJob.redirectJobUrl && externalJob.redirectJobUrl.trim() !== ''
        ? externalJob.redirectJobUrl
        : `${baseJobUrl}${externalJob.jobUrl}`;

    const techStack = (externalJob.technologies?.join(', ') || 'Unknown').slice(0, 255);
    const source = 'DevITJobs'.slice(0, 255);
    const safeApplyUrl = applyUrl.slice(0, 255);

    let normalizedExpLevel = null;
    if(expLevel){
      const match = ALLOWED_EXP_LEVELS.find(level => expLevel.includes(level));
      normalizedExpLevel = match || expLevel; // falls back to the original if not match 
    }
    function mapLocationType(externalWorkplace, cityCategory) {
  const w = (externalWorkplace || "").toLowerCase();

  if (w === "remote") {
    return "remote";
  }
  if (w === "hybrid") {
    return "hybrid";
  }
  return "onsite";
}
    // Insertsa  new job
    await createJob({
      title: externalJob.name,
      company: externalJob.company,
      location: externalJob.actualCity,
      employment_type: mapEmploymentType(externalJob.jobType),
      tech_stack: techStack,
      source,
      external_job_id: externalId, // stores external ID
      apply_url: safeApplyUrl,
      approved_at: null,
      exp_level: normalizedExpLevel, // using the normalized value
      partner_name: externalJob.partnerName,
      active_from : externalJob.activeFrom,
      location_type: mapLocationType(externalJob.workplace, externalJob.cityCategory),
      salary_min: externalJob.annualSalaryFrom ? Math.round(externalJob.annualSalaryFrom) : null,
      salary_max: externalJob.annualSalaryTo ? Math.round(externalJob.annualSalaryTo) : null
    });
  }
}



