import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api.js";
import { markCompanyAsStar, unstarCompany } from "../../utils/staff.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import StaffDashboard from "../../components/Dashboard/StaffDashboard.jsx";


import "../TraineePage/TraineePage.css";
import "./StaffPage.css";

export default function StaffPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectPage = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar after selecting a page on mobile
  };

  useEffect(() => {
    if (activePage === "jobs") {
      loadJobs();
    }
  }, [activePage]);

  async function loadJobs() {
    setLoading(true);
    const res = await fetchWithAuth("/jobs/all");
    setJobs(res?.data?.jobs || []);
    setLoading(false);
  }

  async function handleStar(job) {
    await markCompanyAsStar(job.company);
    setJobs((prev) =>
      prev.map((j) =>
        j.company === job.company ? { ...j, is_star: true } : j
      )
    );
  }

  async function handleUnstar(job) {
    await unstarCompany(job.company);
    setJobs((prev) =>
      prev.map((j) =>
        j.company === job.company ? { ...j, is_star: false } : j
      )
    );
  }

  return (
    <div className="staff-page">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="staff-layout">
        <Sidebar 
          activePage={activePage} 
          onSelectPage={handleSelectPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="staff-content">
          {activePage === "dashboard" && <StaffDashboard />}

          {activePage === "jobs" && (
            <div className="staff-dashboard">
              <h1 className="staff-title">Jobs & Companies</h1>

              {loading && <p>Loading jobs...</p>}

              {!loading && (
                <div className="staff-table-wrapper">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Mark as a Star</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, i) => (
                      <tr key={i}>
                        <td>{job.title}</td>
                        <td>
                          {job.company} {job.is_star && "⭐"}
                        </td>
                        <td>{job.location}</td>
                        <td>{job.is_star ? "Star Company" : "Normal"}</td>
                        <td>
                          {!job.is_star ? (
                            <button
                              className="staff-star-btn"
                              onClick={() => handleStar(job)}
                            >
                              Mark ⭐
                            </button>
                          ) : (
                            <button
                              className="staff-star-btn-remove"
                              onClick={() => handleUnstar(job)}
                            >
                              Remove ⭐
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
              
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
