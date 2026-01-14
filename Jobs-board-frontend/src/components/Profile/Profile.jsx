import { useState, useEffect } from "react";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchMentors();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!userData || !token) {
        console.error("No user data found");
        return;
      }

      const response = await fetch(
        `${API_URL}/profile/${userData.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
      } else {
        console.error("Failed to fetch profile:", data.error);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/mentors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMentors(data.mentors);
      } else {
        console.error("Failed to fetch mentors:", data.error);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const handleSelectMentor = () => {
    if (!selectedMentor) {
      alert("Please select a mentor");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmAssignment = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/assign-trainee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            traineeId: profile.user_id,
            mentorId: parseInt(selectedMentor),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Mentor assigned successfully!");
        setShowModal(false);
        fetchProfile(); // Refresh profile to show new mentor
      } else {
        alert(`Failed to assign mentor: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning mentor:", error);
      alert("An error occurred while assigning mentor");
    }
  };

  const getMentorName = (mentorId) => {
    if (!mentorId) return "No mentor assigned";
    const mentor = mentors.find((m) => m.user_id === mentorId);
    return mentor ? mentor.full_name : "Loading...";
  };

  if (loading) {
    return <div className="profile-container"><p>Loading profile...</p></div>;
  }

  if (!profile) {
    return <div className="profile-container"><p>Unable to load profile</p></div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-field">
            <label>Full Name:</label>
            <span>{profile.full_name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="profile-field">
            <label>Role:</label>
            <span className="role-badge">{profile.user_role}</span>
          </div>
          {profile.description && (
            <div className="profile-field">
              <label>Description:</label>
              <span>{profile.description}</span>
            </div>
          )}
          <div className="profile-field">
            <label>Member Since:</label>
            <span>{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="profile-section mentor-section">
          <h2>Mentor Information</h2>
          
          <div className="profile-field">
            <label>Current Mentor:</label>
            <span className={profile.mentor_id ? "has-mentor" : "no-mentor"}>
              {getMentorName(profile.mentor_id)}
            </span>
          </div>

          {!profile.mentor_id && (
            <div className="assign-mentor-section">
              <h3>Assign Yourself a Mentor</h3>
              <p className="info-text">
                Select a mentor from the list below to guide you in your job search journey.
              </p>
              
              <div className="mentor-select-group">
                <select
                  className="mentor-select"
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                >
                  <option value="">-- Select a Mentor --</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.user_id} value={mentor.user_id}>
                      {mentor.full_name} ({mentor.email})
                    </option>
                  ))}
                </select>

                <button
                  className="assign-button"
                  onClick={handleSelectMentor}
                  disabled={!selectedMentor}
                >
                  Assign Mentor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Mentor Assignment</h3>
            <p>
              Are you sure you want to assign{" "}
              <strong>
                {mentors.find((m) => m.user_id === parseInt(selectedMentor))?.full_name}
              </strong>{" "}
              as your mentor?
            </p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleConfirmAssignment}>
                Yes, Assign
              </button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
