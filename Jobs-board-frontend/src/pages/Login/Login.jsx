import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";


function Login() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();

  const emailStrong = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const isEmailValid = emailStrong.test(email);
  // const isFormValid = email && password; // Simplified validation
 


 const handleLogin = async () => {
   setError("");
   setIsLoading(true);
  
   try {
     const response = await fetch(`${API_URL}/login`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({ email, password })
     });
     const data = await response.json();

     if (response.ok) {
       // Store token in localStorage
       localStorage.setItem("token", data.token);
       localStorage.setItem("user", JSON.stringify(data.user));
      //  const token = localStorage.getItem("token");
      const token = data.token
        const decoded = jwtDecode(token);
        console.log(decoded);
       console.log("Login successful!", data);
       
       // Redirect based on user role
       if (data.user.user_role === "Mentor") {
         navigate("/mentor");
       }
       else if (
         data.user.user_role === "Staff") {
         navigate("/staff");
       } else {
         navigate("/trainee");
       }
       console.log("Logged in user:", data.user);
       console.log("User role:", data.user.user_role);
     } else {
       setError(data.error || "Invalid email or password");
     }
   } catch (error) {
     console.error("Login error:", error);
     setError("Something went wrong. Please try again later.");
   } finally {
     setIsLoading(false);
   }
   


 };

   
  
 

 return (
   <main className="login-page">
     <div className="login-form-container">
      <h1>Please login here</h1>
      
       <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
       />
      
       <div className="password-field">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        className="toggle-password-btn"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      
       {error && <div style={{ color: "red" }}>{error}</div>}
      
       <button
         onClick={handleLogin}
         
        
       >
         {isLoading ? "Loading..." : "Log in"}
       </button>


       <div className="forgot-password-container">
         {/* <p>
           Forgot your password?{" "}
           <a href="/reset-password">
             Reset it here
           </a>
         </p> */}
         <p>
           Don't have an account?{" "}
           <Link to="/signup">
             Sign up here
           </Link>
         </p>
       </div>
     </div>
   </main>
 );
}


export default Login;