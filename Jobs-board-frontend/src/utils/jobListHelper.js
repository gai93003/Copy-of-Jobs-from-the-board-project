export function applyStarFilter(jobs, starCompaniesOnly) {
  if (!starCompaniesOnly) return jobs;
  return jobs.filter(job => job.is_star === true);
}

export function sortJobs(jobs, sortBy, sortDirection) {
  if (sortBy === "date") {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.active_from);
      const dateB = new Date(b.active_from);
      if (isNaN(dateA) || isNaN(dateB)) return 0;

      // desc = newest first
      if (sortDirection === "desc") {
        return dateB - dateA;
      }
      // asc = oldest first
      return dateA - dateB;
    });
  }

  if (sortBy === "salary") {
    return [...jobs].sort((a, b) => {
      const aMin = a.salary_min ?? 0;
      const bMin = b.salary_min ?? 0;

      if (sortDirection === "asc") {
        return aMin - bMin;   // low to high
      }
      return bMin - aMin;     // high to low
    });
  }

  return jobs;
}
export function formatCurrency(value, currency = "GBP") {
  if (value == null) return null;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatSalaryRange(min, max, currency = "GBP") {
  const minText = formatCurrency(min, currency);
  const maxText = formatCurrency(max, currency);
 
  if (!minText && !maxText) return null;
  if (minText && maxText && min !== max) return `${minText} – ${maxText}`;
  if (minText && maxText && min === max) return `${minText}`;
  if (minText) return `From ${minText}`;
  return `Up to ${maxText}`;
}

export function applyApiSourceFilter(jobs, apiSource) {
  // apiSource examples: "" | "CYFslack" | "DevitJobs"
  if (!apiSource) return jobs;
  return jobs.filter(job => job.api_source === apiSource);
}
