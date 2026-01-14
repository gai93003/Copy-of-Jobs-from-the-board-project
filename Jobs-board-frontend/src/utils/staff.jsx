import { fetchWithAuth } from "./api.js";
import { Navigate } from "react-router-dom";

export async function markCompanyAsStar(company) {
  return fetchWithAuth("/staff/star-company", {
    method: "POST",
    body: JSON.stringify({ company })
  });
}

export async function unstarCompany(company) {
  return fetchWithAuth(`/staff/star-company/${company}`, {
    method: "DELETE"
  });
}

/////Protection Route///////

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.user_role)) {
    // Redirect to their own dashboard
    if (user.user_role === "Trainee") return <Navigate to="/trainee" replace />;
    if (user.user_role === "Mentor") return <Navigate to="/mentor" replace />;
    if (user.user_role === "Staff") return <Navigate to="/staff" replace />;

    
    return <Navigate to="/login" replace />;
  }

  return children;
}
