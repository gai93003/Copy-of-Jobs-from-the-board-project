import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import { updateApplicationStatus } from "../../utils/applications";
import { CommentSection } from "../CommentSection/CommentSection";
import "./TraineeApplications.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";

export function TraineeApplications({ trainee, onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const mentorId = currentUser?.user_id;

  useEffect(() => {
    fetchTraineeApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainee.user_id]);

  const fetchTraineeApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/applications?userId=${trainee.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications || []);
      } else {
        console.error("Failed to fetch applications:", data.error);
      }
    } catch (error) {
      console.error("Error fetching trainee applications:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleStatusChange(application_id, newStatus) {
    await updateApplicationStatus(application_id, newStatus);

    // Update local state so UI refreshes immediately
    setApplications(
      applications.map((app) =>
        app.application_id === application_id
          ? { ...app, status: newStatus }
          : app
      )
    );
  }

  if (loading) {
    return (
      <div className="trainee-applications">
        <button onClick={onBack} className="back-button">
          ← Back to My Trainees
        </button>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="trainee-applications">
      <div className="trainee-applications-header">
        <button onClick={onBack} className="back-button">
          ← Back to My Trainees
        </button>
        <h2>Mentee: {trainee.full_name}'s Applications</h2>
        <p className="trainee-email">{trainee.email}</p>
      </div>

      {applications.length === 0 ? (
        <p className="no-applications">
          {trainee.full_name} hasn't applied to any jobs yet.
        </p>
      ) : (
        <ul className="applications-list">
          {applications.map((app) => (
            <JobCard
              key={app.application_id}
              {...app}
              onStatusChange={(newStatus) =>
                handleStatusChange(app.application_id, newStatus)
              }
            />
          ))}
        </ul>
      )}

      {mentorId && (
        <CommentSection
          traineeId={trainee.user_id} 
          mentorId={mentorId} 
          mode="mentor"
        />
      )}
    </div>
  );
}
