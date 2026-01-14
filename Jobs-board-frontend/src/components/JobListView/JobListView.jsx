import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import {
  markJobInterested,
  fetchUserApplications,
  updateApplicationStatus,
  deleteApplication
} from "../../utils/applications.js";

import {
  applyStarFilter,
  sortJobs,
  applyApiSourceFilter
} from "../../utils/jobListHelper.js";

import { dedupeByJobId } from "../../utils/jobDedupe.js";

import "../Dashboard/Dashboard.css";

const PAGE_SIZE = 8;


export default function JobListView({
  subtitle,
  fetchJobs,
  mode = "dashboard"
}) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [interestedJobs, setInterestedJobs] = useState(new Set());

  // filters
  const [location, setLocation] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [techStack, setTechStack] = useState("");
  const [locationType, setLocationType] = useState("");
  const [sortBy, setSortBy] = useState("date");      // "date" | "salary"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" | "desc"
  const [starCompaniesOnly, setStarCompaniesOnly] = useState(false);

  // NEW: api_source filter
  const [apiSource, setApiSource] = useState(""); // "" | "CYFslack" | "DevitJobs"

  useEffect(() => {
    async function load() {
      setLoading(true);

      if (mode === "dashboard") {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (locationType) params.set("location_type", locationType);
        if (expLevel) params.set("exp_level", expLevel);
        if (techStack) params.set("tech_stack", techStack);
        if (starCompaniesOnly) params.set("star_companies", "true");
        const queryString = params.toString() ? `?${params.toString()}` : "";

        const [jobsData, apps] = await Promise.all([
          fetchJobs(queryString),
          fetchUserApplications()
        ]);

        setJobs(jobsData || []);

        const interested = new Set(
          (apps?.data?.applications || []).map(app => app.job_id)
        );
        setInterestedJobs(interested);

        setPage(1);
      }

      if (mode === "applications") {
        const apps = await fetchUserApplications();
        const applicationsList = apps?.data?.applications || [];
        setJobs(applicationsList);
        setInterestedJobs(new Set());
        setPage(1);
      }

      setLoading(false);
    }

    load();

  // }, [ mode, fetchJobs,fetchJobsSlack, location, locationType, expLevel, techStack, starCompaniesOnly, sortBy, sortDirection]);

 
  // // Filter + sort pipeline
  // const filteredSlackJobs = applyStarFilter(slackJobs, starCompaniesOnly);
  // const filteredApiJobs = applyStarFilter(apiJobs, starCompaniesOnly, starCompaniesOnly, sortBy, sortDirection);

  }, [mode, fetchJobs, location, locationType, expLevel, techStack, starCompaniesOnly, sortBy, sortDirection]);

  // filter + sort pipeline (dashboard only)
  let filtered = jobs;


// dashboard only filters
    if (mode === "dashboard") {
      filtered = applyApiSourceFilter(filtered, apiSource);
      filtered = applyStarFilter(filtered, starCompaniesOnly);
       // NEW: remove duplicates by job_id
      filtered = dedupeByJobId(filtered);
      filtered = sortJobs(filtered, sortBy, sortDirection);
     
    }

  // pagination
    const start = (page - 1) * PAGE_SIZE;
    const pagedJobs = filtered.slice(start, start + PAGE_SIZE);
    const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);

  async function handleInterested(job) {
    try {
      const result = await markJobInterested(job.job_id);
      if (result?.response?.ok) {
        setInterestedJobs(prev => new Set([...prev, job.job_id]));
      }
    } catch (error) {
      alert(`Failed to mark job as interested: ${error.message}`);
    }
  }

  async function handleStatusChange(application_id, newStatus) {
    await updateApplicationStatus(application_id, newStatus);
    setJobs(prev =>
      prev.map(job =>
        job.application_id === application_id
          ? { ...job, status: newStatus }
          : job
      )
    );
  }

  async function handleDeleteApplication(applicationId) {
    if (!window.confirm("Remove this application?")) return;

    try {
      await deleteApplication(applicationId);

      const deletedJob = jobs.find(j => j.application_id === applicationId);
      const deletedJobId = deletedJob?.job_id;

      setJobs(prev => prev.filter(j => j.application_id !== applicationId));

      if (deletedJobId) {
        setInterestedJobs(prev => {
          const next = new Set(prev);
          next.delete(deletedJobId);
          return next;
        });
      }
    } catch (error) {
      alert(`Failed to delete application: ${error.message}`);
    }
  }

  return (
    <div className="dashboard-container">
      {subtitle && <p className="subtitle">{subtitle}</p>}

      {/* Filters only on dashboard mode */}
      {mode === "dashboard" && (
        <div className="filters">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />

          <select value={locationType} onChange={e => setLocationType(e.target.value)}>
            <option value="">Any location type</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>

          <select value={expLevel} onChange={e => setExpLevel(e.target.value)}>
            <option value="">Any level</option>
            <option value="junior">Junior</option>
            <option value="regular">Regular</option>
          </select>

          <input
            type="text"
            placeholder="Tech (e.g. React)"
            value={techStack}
            onChange={e => setTechStack(e.target.value)}
          />

          {/* api_source filter */}
          <select value={apiSource} onChange={e => setApiSource(e.target.value)}>
            <option value="">All sources</option>
            <option value="CYFslack">CYF Slack</option>
            <option value="DevitJobs">Platform API</option>
          </select>

          {/* sorting */}
          <select
            value={`date-${sortDirection}`}
            onChange={e => {
              const dir = e.target.value.split("-")[1];
              setSortBy("date");
              setSortDirection(dir);
            }}
          >
            <option value="date-desc">Date posted: Newest</option>
            <option value="date-asc">Date posted: Oldest</option>
          </select>

          <select
            value={`salary-${sortDirection}`}
            onChange={e => {
              const dir = e.target.value.split("-")[1];
              setSortBy("salary");
              setSortDirection(dir);
            }}
          >
            <option value="salary-asc">Salary: Low → High</option>
            <option value="salary-desc">Salary: High → Low</option>
          </select>

          <label>
             <input // star filter is here
          type="checkbox"
          checked={starCompaniesOnly}
          onChange={e => setStarCompaniesOnly(e.target.checked)}
          />
          Only Star Companies
          </label>
         
        </div>
      )}

      <hr className="divider" />

      {loading && <p className="loading">Loading jobs...</p>}

      {!loading && pagedJobs.length === 0 && (
        <p className="no-jobs">No jobs found.</p>
      )}

      {!loading && pagedJobs.length > 0 && (
        <ul className="jobs-grid">
          {pagedJobs.map((job, i) => (
            <JobCard
              key={
                mode === "dashboard"
                  ? `job-${job.job_id}-${i}`
                  : `app-${job.application_id}-${i}`
              }
              {...job}
              {...(mode === "dashboard"
                ? {
                    onInterested: handleInterested,
                    isInterested: interestedJobs.has(job.job_id)
                  }
                : {
                    onStatusChange: newStatus =>
                      handleStatusChange(job.application_id, newStatus),
                    onDelete: () => handleDeleteApplication(job.application_id)
                  })}
            />
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
