import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import {TraineePage} from './pages/TraineePage/TraineePage.jsx';
import {MentorPage} from './pages/mentorPage/MentorPage.jsx';
import SignUp from "./pages/SignUp/SignUp.jsx";
import StaffPage from "./pages/StaffPage/StaffPage.jsx";
import ProtectedRoute from "./utils/staff.jsx";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/trainee" element={<ProtectedRoute allowedRoles={["Trainee"]}> <TraineePage /> </ProtectedRoute> } />
      
      <Route path="/mentor" element={<ProtectedRoute allowedRoles={["Mentor"]}> <MentorPage /> </ProtectedRoute> } />

      <Route path="/staff" element={<ProtectedRoute allowedRoles={["Staff"]}> <StaffPage /> </ProtectedRoute> } />

    </Routes>
  );
}

export default App;
