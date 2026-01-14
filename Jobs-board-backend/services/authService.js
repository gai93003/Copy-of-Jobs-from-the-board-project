import bcrypt from "bcrypt";
import { pool } from "../DB/db.js";

//Create a new user in DB
async function signup(full_name,email,password,user_role,description,account_status,mentor_id){
    //Create Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Insert new user to DB
  const result = await pool.query(
    `INSERT INTO users 
    (full_name, email, password_hash, user_role, description, account_status, mentor_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING user_id, full_name, email, user_role, description, account_status, mentor_id`,
    [full_name, email, password_hash, user_role, description, account_status, mentor_id]
  );
  return result.rows[0]
}

async function checkUniqEmail(email){
    // Check email uniqueness
    const emailCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return emailCheck.rows.length > 0; // true if exists
}

//Show users list from DB
async function usersList(){
    const usersList = await pool.query(
        `SELECT * FROM users`
    );
    return usersList.rows
}

//Get user by email for login
async function getUserByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0]; // return user or undefined
}

//Get all trainees
async function getTraineesList() {
    const result = await pool.query(
        "SELECT user_id, full_name, email, description, mentor_id FROM users WHERE user_role = $1",
        ['Trainee']
    );
    return result.rows;
}

//Assign a trainee to a mentor
async function assignTraineeToMentor(traineeId, mentorId) {
    const result = await pool.query(
        "UPDATE users SET mentor_id = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND user_role = 'Trainee' RETURNING user_id, full_name, email, description, mentor_id",
        [mentorId, traineeId]
    );
    return result.rows[0];
}

//Get trainees assigned to a specific mentor
async function getAssignedTrainees(mentorId) {
    const result = await pool.query(
        "SELECT user_id, full_name, email, description, mentor_id, created_at FROM users WHERE mentor_id = $1 AND user_role = 'Trainee'",
        [mentorId]
    );
    return result.rows;
}

//Get all mentors
async function getMentorsList() {
    const result = await pool.query(
        "SELECT user_id, full_name, email, description FROM users WHERE user_role = $1",
        ['Mentor']
    );
    return result.rows;
}

//Get user by ID
async function getUserById(userId) {
    const result = await pool.query(
        "SELECT user_id, full_name, email, user_role, description, mentor_id, created_at FROM users WHERE user_id = $1",
        [userId]
    );
    return result.rows[0];
}

export{signup, checkUniqEmail, usersList, getUserByEmail, getTraineesList, assignTraineeToMentor, getAssignedTrainees, getMentorsList, getUserById}
