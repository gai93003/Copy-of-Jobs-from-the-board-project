import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { TraineeCard } from "../../components/TraineeCard/TraineeCard";
import { TraineeApplications } from "../../components/TraineeApplications/TraineeApplications";
import { fetchWithAuth } from "../../utils/api";
import "./MentorPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";
export function MentorPage() {
    const [trainees, setTrainees] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [assignedTrainees, setAssignedTrainees] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [viewingApplications, setViewingApplications] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Get current user from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(user);
        if (user) {
            fetchAssignedTrainees(user.user_id);
        }
    }, []);

    // Fetch trainees on component mount
    useEffect(() => {
        fetchTrainees();
    }, []);

    const fetchTrainees = async () => {
        setIsLoading(true);
        try {
            const result = await fetchWithAuth("/trainees");
            if (result && result.data) {
                setTrainees(result.data.trainees || []);
            }
        } catch (error) {
            console.error("Error fetching trainees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAssignedTrainees = async (mentorId) => {
        try {
            const result = await fetchWithAuth(`/my-trainees/${mentorId}`);
            if (result && result.data) {
                setAssignedTrainees(result.data.trainees || []);
            }
        } catch (error) {
            console.error("Error fetching assigned trainees:", error);
        }
    };

    const handleTraineeChange = (e) => {
        const traineeId = e.target.value;
        setSelectedTrainee(traineeId);
        if (traineeId) {
            setShowConfirmation(true);
        }
    };

    const handleAssignTrainee = async () => {
        if (!selectedTrainee || !currentUser) return;

        try {
            const response = await fetch(`${API_URL}/assign-trainee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    traineeId: parseInt(selectedTrainee),
                    mentorId: currentUser.user_id
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Trainee assigned successfully!");
                setShowConfirmation(false);
                setSelectedTrainee("");
                // Refresh assigned trainees list
                fetchAssignedTrainees(currentUser.user_id);
                // Refresh available trainees list
                fetchTrainees();
            } else {
                alert(data.error || "Failed to assign trainee");
            }
        } catch (error) {
            console.error("Error assigning trainee:", error);
            alert("Failed to assign trainee");
        }
    };

    const handleCancelAssignment = () => {
        setShowConfirmation(false);
        setSelectedTrainee("");
    };

    const selectedTraineeDetails = trainees.find(
        t => t.user_id === parseInt(selectedTrainee)
    );

    const handleViewApplications = (trainee) => {
        setViewingApplications(trainee);
    };

    const handleBackToTrainees = () => {
        setViewingApplications(null);
    };

  // If viewing a trainee's applications, show that view
  if (viewingApplications) {
    return (
      <div className="mentor-page">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="mentor-layout">
          <main className="trainee-content">
            <TraineeApplications 
              trainee={viewingApplications} 
              onBack={handleBackToTrainees}
            />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mentor-page">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="mentor-layout">
        <main className="trainee-content">
          <div className="mentor-dropdown-section">
            <h2>Select a Trainee to Assign</h2>
            <select 
              value={selectedTrainee} 
              onChange={handleTraineeChange}
              disabled={isLoading || showConfirmation}
              className="mentor-dropdown"
            >
              <option value="">-- Select a Trainee --</option>
              {trainees
                .filter(trainee => !trainee.mentor_id) // Only show unassigned trainees
                .map((trainee) => (
                  <option key={trainee.user_id} value={trainee.user_id}>
                    {trainee.full_name} - {trainee.email}
                  </option>
                ))}
            </select>
          </div>

          {showConfirmation && selectedTraineeDetails && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <h3>Assign Trainee</h3>
                <p>Do you want to assign <strong>{selectedTraineeDetails.full_name}</strong> as your mentee?</p>
                <div className="confirmation-buttons">
                  <button onClick={handleAssignTrainee} className="btn-confirm">
                    Yes, Assign
                  </button>
                  <button onClick={handleCancelAssignment} className="btn-cancel">
                    No, Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="assigned-trainees-section">
            <h2>My Assigned Trainees</h2>
            {assignedTrainees.length === 0 ? (
              <p className="no-trainees">You haven't assigned any trainees yet.</p>
            ) : (
              <ul className="trainees-list">
                {assignedTrainees.map((trainee) => (
                  <TraineeCard 
                    key={trainee.user_id} 
                    trainee={trainee}
                    onViewApplications={handleViewApplications}
                  />
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
