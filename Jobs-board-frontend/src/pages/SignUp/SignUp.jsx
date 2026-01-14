import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import './signup.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";

function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  async function submitFormData(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const full_name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm_password = formData.get("confirm-password");
    const user_role = formData.get("role");

    if (password !== confirm_password) {
      setErrorMessage("Passwords do not match!");
      setPasswordError(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ full_name, email, password, confirm_password, user_role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("You have successfully signed up!");
        console.log("signup success",data);
        setErrorMessage(""); // clear error
        setPasswordError(false);
         navigate("/login")
      } else {
        console.log("Signup error response:", response.status, data);
        setErrorMessage(data.error || "Failed to signup, please try again...");
      }
    } catch (error) {
      console.error("Signup error.", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  }

  return (
    <main className="signup-container">
      <h1>CYF Job Board</h1>
      <section className="login-container">
        <article className="header">
          <h1>Create Your Account</h1>
          <p>Join the CYF Job Board Community</p>
        </article>

        <form onSubmit={submitFormData} id="signup-form">
          <fieldset>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email address" 
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Create a password"
              required
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
            {/* <p className="password-char-count">8+ characters, one number</p> */}

            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm your password"
                required
                className={passwordError ? "not-matching-password" : ""}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errorMessage && <p id="password-validator" className="password-validator">{errorMessage}</p>}

            <label htmlFor="role">Select Your Role</label>
            <select name="role" id="role">
              <option value="Trainee">Trainee</option>
              <option value="Mentor">Mentor</option>
              <option value="Staff">Staff</option>
            </select>
          </fieldset>

          <button id="register-btn">Register</button>
        </form>
      </section>
      <section className="go-to-login">
        <p>Already have an account? <Link to="/login" className="login-link">Log in</Link></p>
      </section>
    </main>
  );
}


export default SignUp