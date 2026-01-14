import { fetchWithAuth, getLoggedInUser } from "./api.js";


export async function markJobInterested(job_id) {
  const { user_id } = getLoggedInUser();

  const result = await fetchWithAuth("/applications", {
    method: "POST",
    body: JSON.stringify({
      user_id,
      job_id,
      status: "Interested" 
    }),
  });

  // Check if the request was successful
  if (!result || !result.response.ok) {
    throw new Error(result?.data?.error || "Failed to create application");
  }

  return result;
}


export async function fetchUserApplications() {
  const { user_id } = getLoggedInUser();
  return fetchWithAuth(`/applications?userId=${user_id}`);
}

export async function updateApplicationStatus(application_id, status) {
  return fetchWithAuth(`/applications/${application_id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}


// export async function deleteApplication(applicationId) {
//   try {
//     const result = await fetchWithAuth(`/applications/${applicationId}`, {
//       method: "DELETE",
//     });

//     if (!result.response.ok) {
//       throw new Error(result.data?.message || "Failed to delete application due to server error.");
//     }
//     return { ok: true, data: result.data };

//   } catch (error) {
//     console.error("Error deleting application:", error);

//     if (error.message.includes("Unexpected token '<'") || error.message.includes("Unexpected end of JSON input")) {
//         return { ok: true, message: "Application deleted successfully (assumed success after parsing error)" };
//     }
//     throw error;
//   }

export async function deleteApplication(applicationId) {
  const result = await fetchWithAuth(`/applications/${applicationId}`, {
    method: "DELETE",
    
  });

  if (!result.response.ok) {
    throw new Error(result.data?.error || "Failed to delete application");
  }

  return result.data;
}