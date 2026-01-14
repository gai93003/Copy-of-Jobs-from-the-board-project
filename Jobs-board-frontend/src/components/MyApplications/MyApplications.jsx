import JobListView from "../JobListView/JobListView";
import { CommentSection } from "../CommentSection/CommentSection";
import "./MyApplications.css";   // ⬅️ add this

export default function MyApplications() {
//    const user = JSON.parse(localStorage.getItem("user") || "null");

//   return (
//     <div>
//       <JobListView
//         title={`${user.full_name.toUpperCase()} 's Applications`}
//         subtitle="Manage your job application progress"
//         mode="applications"
//       />

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;
  const mentorId = user?.mentor_id;

  return (
    <div className="applications-layout">
      <section className="applications-board">
        <h1 className="applications-title">
          {user?.full_name?.toUpperCase()}’s Applications
        </h1>
        <p className="applications-subtitle">
          Manage your job application progress across each stage.
        </p>

        <JobListView
          subtitle=""
          mode="applications"
        />
      </section>

      {/* RIGHT: comments */}
      <aside className="applications-comments">
        {mentorId ? (
          <CommentSection
            traineeId={userId}
            mentorId={mentorId}
            mode="trainee"
          />
        ) : (
          <div className="no-mentor-card">
            <h3>No mentor assigned yet</h3>
            <p>
              Once you’re matched with a mentor, your conversation about your job
              hunt will appear here.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
