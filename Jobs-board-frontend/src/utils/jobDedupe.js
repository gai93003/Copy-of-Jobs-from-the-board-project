export function dedupeByJobId(jobsArray) {
  const seen = new Set();
  const result = [];

  for (const job of jobsArray || []) {
    if (!job.job_id) {
      result.push(job);              // keep rows without job_id
      continue;
    }
    if (seen.has(job.job_id)) {
      continue;                      // skip duplicate
    }
    seen.add(job.job_id);
    result.push(job);
  }

  return result;
}
