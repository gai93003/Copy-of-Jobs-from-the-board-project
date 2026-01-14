import { fetchWithAuth } from "../../utils/api";
import JobListView from "../JobListView/JobListView";
import { getLoggedInUser } from "../../utils/api";
import "./Dashboard.css"

export function Dashboard() {
    const user = getLoggedInUser();

  return (
  
      <JobListView
        subtitle="All Jobs from API:"
        mode="dashboard"
        fetchJobs={fetchAllJobs}
        // fetchJobsSlack={fetchSlackJobs}
        // fetchJobs={fetchApiJobs}
      />
     
  );
}

export async function fetchAllJobs(queryString = "") {
  const url = queryString ? `/jobs/all${queryString}` : `/jobs/all`;

  const { response, data } = await fetchWithAuth(url);

  if (!response.ok || !data?.jobs) return [];
  return data.jobs; // sorting done in JobListView
}


// export async function fetchApiJobs(queryString = "") {
//   const url = queryString
//     ? `/jobs/all${queryString}&api_source=DevitJobs`
//     : `/jobs/all?api_source=DevitJobs`;
//   const { response, data } = await fetchWithAuth(url)
//   console.log(response, data);

//   if (!response.ok || !data?.jobs) {
//     return [];
//   }

//   return data.jobs.sort(
//     (a, b) => new Date(b.active_from) - new Date(a.active_from)
//   );
// }



// // ******************* I can add Slack chennel API here ********************

// export async function fetchSlackJobs(queryString = "") {
//   const url = queryString
//     ? `/jobs/all${queryString}&api_source=CYFslack`
//     : `/jobs/all?api_source=CYFslack`;
//   const { response, data } = await fetchWithAuth(url)
//   console.log(response, data);

//   if (!response.ok || !data?.jobs) return [];

//   return data.jobs.sort(
//     (a, b) => new Date(b.active_from) - new Date(a.active_from)
//   );
// }