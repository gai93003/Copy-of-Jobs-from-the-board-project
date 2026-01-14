// API utility for making authenticated requests

// Use local backend for development, production URL when deployed
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";


// Logout function - clears token and redirects to login
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Helper function to make authenticated API calls
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }

    return { response, data };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export function getLoggedInUser() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let decodedUserId = null;
  let storedUser = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      decodedUserId = payload.user_id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  if (userStr) {
    try {
      storedUser = JSON.parse(userStr);
    } catch (err) {
      console.error("Invalid user object in localStorage", err);
    }
  }

  return {
    user_id: decodedUserId,
    full_name: storedUser?.full_name || null,
    email: storedUser?.email || null,
    role: storedUser?.user_role || null,
    raw: storedUser || null,
  };
}
