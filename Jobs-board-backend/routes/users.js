import express from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupValidation } from "../validation/authValidation.js";
import { signup,checkUniqEmail, usersList, getUserByEmail, getTraineesList, assignTraineeToMentor, getAssignedTrainees, getMentorsList, getUserById } from "../services/authService.js";
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

/////// signup//////////////

router.post("/signup",async (req, res) => {
    const {
        full_name,
        email,
        password,
        confirm_password,
        user_role,
        description,
        mentor_id
    } = req.body;

// Validation
    const validationError = signupValidation(full_name,email, password,confirm_password)
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

// Check if email exists
    const exists = await checkUniqEmail(email);

    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }


// Set defaults for optional fields
const account_status = 'Pending'; // Default status for new users
const finalUserRole = user_role || 'Trainee'; // Default to Trainee if not specified
const finalDescription = description || null;
const finalMentorId = mentor_id || null;

const newUser = await signup(full_name,email,password,finalUserRole,finalDescription,account_status,finalMentorId)

 
res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});


/////// Login//////////////

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Get user from database
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare password with hash
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                user_id: user.user_id,
                email: user.email,
                user_role: user.user_role 
            }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Send response with token and user info
        res.json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                user_role: user.user_role,
                account_status: user.account_status,
                mentor_id: user.mentor_id
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});


/////// User//////////////

router.get("/users", async(req, res) => {
const users = await usersList();
  res.json({users});
});


/////// trainee//////////////

router.get("/trainees", async(req, res) => {
  try {
    const trainees = await getTraineesList();
    res.json({trainees});
  } catch (error) {
    console.error("Error fetching trainees:", error);
    res.status(500).json({ error: "Failed to fetch trainees" });
  }
});

// Assign a trainee to a mentor
router.post("/assign-trainee", async(req, res) => {
  try {
    const { traineeId, mentorId } = req.body;
    
    if (!traineeId || !mentorId) {
      return res.status(400).json({ error: "traineeId and mentorId are required" });
    }
    
    const updatedTrainee = await assignTraineeToMentor(traineeId, mentorId);
    
    if (!updatedTrainee) {
      return res.status(404).json({ error: "Trainee not found or not a trainee" });
    }
    
    res.json({ message: "Trainee assigned successfully", trainee: updatedTrainee });
  } catch (error) {
    console.error("Error assigning trainee:", error);
    res.status(500).json({ error: "Failed to assign trainee" });
  }
});

// Get trainees assigned to a mentor
router.get("/my-trainees/:mentorId", async(req, res) => {
  try {
    const { mentorId } = req.params;
    const trainees = await getAssignedTrainees(mentorId);
    res.json({ trainees });
  } catch (error) {
    console.error("Error fetching assigned trainees:", error);
    res.status(500).json({ error: "Failed to fetch assigned trainees" });
  }
});

// Get all mentors
router.get("/mentors", async(req, res) => {
  try {
    const mentors = await getMentorsList();
    console.log(mentors)
    res.json({ mentors });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

// Get user profile by ID
router.get("/profile/:userId", async(req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});




export default router;