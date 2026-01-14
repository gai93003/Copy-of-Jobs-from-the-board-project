import "./Sidebar.css";
export default function Sidebar({ activePage, onSelectPage, isOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.user_role;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <h2 className="sidebar-title">{role} Menu</h2>

        <nav className="sidebar-nav">
          {/* DASHBOARD FOR ALL */}
          <button
            className={`sidebar-item ${activePage ==="dashboard" ? "active" : ""}`}
            onClick={() => onSelectPage("dashboard")}
          >
            Dashboard
          </button>

        {/* ✅ STAFF ONLY */}
        {role === "Staff" && (
          <button
            className={`sidebar-item ${activePage ==="jobs" ? "active" : ""}`}
            onClick={() => onSelectPage("jobs")}
          >
            Jobs & Companies
          </button>
        )}

          {/* TRAINEE ONLY */}
          {role === "Trainee" && (
            <button
              className={`sidebar-item ${activePage ==="applications" ? "active" : ""}`}
              onClick={() => onSelectPage("applications")}
            >
              My Applications
            </button>
          )}
          {/* TRAINEE ONLY */}
          {role === "Trainee" && (
            <button
              className={`sidebar-item ${activePage ==="insights" ? "active" : ""}`}
              onClick={() => onSelectPage("insights")}
            >
              Insights
            </button>
          )}
          {/* ✅ STAFF ONLY */}
          {role === "Staff" && (
            <button
              className={`sidebar-item ${activePage ==="jobs" ? "active" : ""}`}
              onClick={() => onSelectPage("jobs")}
            >
              Star Companies
            </button>
          )}

          {/* ✅ MENTOR ONLY */}
          {role === "Mentor" && (
            <button
              className={`sidebar-item ${activePage ==="trainees" ? "active" : ""}`}
              onClick={() => onSelectPage("trainees")}
            >
              My Trainees
            </button>
          )}

          <button
          className={`sidebar-item ${activePage ==="profile" ? "active" : ""}`}
          onClick={() => onSelectPage("profile")}
          >Profile
          </button>

          {/* <button className="sidebar-item">Settings</button> */}
        </nav>
      </aside>
         </>
      )}
   
      