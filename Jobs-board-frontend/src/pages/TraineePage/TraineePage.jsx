
import { useState } from "react";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import MyApplications from "../../components/MyApplications/MyApplications";
import { Profile } from "../../components/Profile/Profile";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Insights from "../../components/Insights/Insights";
import "./TraineePage.css";

export function TraineePage() {
  const [activePage, setActivePage] = useState("dashboard"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // dashboard is default

  const handleSelectPage = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar after selecting a page on mobile
  };

  return (
    <div className="trainee-page">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="trainee-layout">
        <Sidebar 
          activePage={activePage} 
          onSelectPage={handleSelectPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="trainee-content">
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "applications" && <MyApplications />}
          {activePage === "profile" && <Profile />}
          {activePage === "insights" && <Insights />}
        </main>
      </div>

      <Footer />
    </div>
  );
}
