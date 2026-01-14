
// Mock USERS table
const mockUsers = [
  { user_id: 1, fullname: "Gabriel" },
  { user_id: 2, fullname: "Sathu" },
  { user_id: 3, fullname: "Rihanna" },
  { user_id: 4, fullname: "Donara" }
];


// Mock JOBS table

export const mockJobs = [
  {
    job_id: 11,
    user_id: 1,
    title: "Frontend Developer",
    company: "Innovate Inc.",
    location: "Remote",
    employment_type: "Full-time",
    exp_level: "Junior",
    partner_name: "LinkedIn",
    apply_url: "https://apply.frontend.com",
    approved_at: "2024-01-10",
  },
  {
    job_id: 12,
    user_id: 1,
    name: "UI/UX Engineer",
    company: "SkyTech",
    cityCategory: "Berlin",
    jobType: "Contract",
    expLevel: "Regular",
    partnerName: "Indeed",
    apply_url: "https://apply.ui.com",
    approved_at: "2024-01-12",
  },
  {
    job_id: 22,
    user_id: 2,
    name: "Full Stack Engineer",
    company: "BuildIt",
    cityCategory: "Paris",
    jobType: "Part-time",
    expLevel: "Junior",
    partnerName: "CYF Slack",
    apply_url: "https://apply.stack.com",
    approved_at: "2024-02-01",
  },
  {
    job_id: 21,
    user_id: 2,
    name: "Backend Developer",
    company: "Tech Solutions",
    cityCategory: "London",
    jobType: "Full-time",
    expLevel: "Regular",
    partnerName: "Arbeitnow",
    apply_url: "https://apply.backend.com",
    approved_at: "2024-01-05",
  },
  {
    _id: 22,
    user_id: 3,
    name: "Full Stack Engineer",
    company: "BuildIt",
    cityCategory: "Paris",
    jobType: "Part-time",
    expLevel: "Junior",
    partnerName: "CYF Slack",
    apply_url: "https://apply.stack.com",
    approved_at: "2024-02-01",
  }
];


// Sample GET /users
export function getUsers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 300); //delay
  });
}

// Sample GET /jobs?userId=1
export function getJobsByUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredJobs = mockJobs.filter(
        (job) => job.user_id === Number(userId)
      );
      resolve(filteredJobs);
    }, 400); 
  });
}

export async function getJobs() {
  return[
  {
    job_id: 11,
    name: "Frontend Developer",
    company: "Innovate Inc.",
    cityCategory: "Remote",
    jobType: "Full-time",
    expLevel: "Regular",
    partnerName: "LinkedIn",
    apply_url: "https://apply.frontend.com",
    approved_at: "2024-01-10",
  },
  {
    _id: 12,
    name: "UI/UX Engineer",
    company: "SkyTech",
    cityCategory: "Berlin",
    jobType: "Contract",
    expLevel: "Regular",
    partnerName: "Indeed",
    apply_url: "https://apply.ui.com",
    approved_at: "2024-01-12",
  },
  {
    _id: 21,
    name: "Backend Developer",
    company: "Tech Solutions",
    cityCategory: "London",
    jobType: "Full-time",
    expLevel: "Regular",
    partnerName: "Arbeitnow",
    apply_url: "https://apply.backend.com",
    approved_at: "2024-01-05",
  },
  {
    _id: 22,
    name: "Full Stack Engineer",
    company: "BuildIt",
    cityCategory: "Paris",
    jobType: "Part-time",
    expLevel: "Regular",
    partnerName: "CYF Slack",
    apply_url: "https://apply.stack.com",
    approved_at: "2024-02-01",
  }
];
}
