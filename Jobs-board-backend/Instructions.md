COMPLETE SETUP & TESTING GUIDE

STEP 1: Ensure PostgreSQL is running

    sudo systemctl status postgresql
    # If not running:
    sudo systemctl start postgresql

STEP 2: Set PostgreSQL password (if not already done)

    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
    
STEP 3: Navigate to backend directory

STEP 4: Install dependencies (if not already done)

    npm install

STEP 5: Run database migrations

    node migrate.js

Expected output: ✅ DB setup finished

STEP 6: Start the backend server

    node server.js

Expected output:

    Server running on port 5501
    DB Connected via Pool


TESTING THE 6 CASES

Open a new terminal and follow the following instructions.

SETUP: Create a test user

curl -s -X POST http://localhost:5501/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Gabriel Deng",
    "email": "gabriel@test.com",
    "password": "password123",
    "confirm_password": "password123",
    "user_role": "Trainee"
  }' | jq .

SETUP: Create a test job

curl -s -X POST http://localhost:5501/api/jobs \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "title": "Senior Developer",
    "company": "Tech Corp",
    "location": "New York",
    "employment_type": "Full-time",
    "tech_stack": "Node.js, React, PostgreSQL",
    "source": "LinkedIn",
    "apply_url": "https://example.com/apply"
  }' | jq .
  


CASE 1: Application Started

curl -s -X POST http://localhost:5501/api/applications \
  -H "Content-Type: application/json" \
  -d '{"user_id":5,"job_id":1,"status":"Application Started"}' | jq .

CASE 2: Application Submitted

curl -s -X PATCH http://localhost:5501/api/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Application Submitted"}' | jq .

CASE 3: Invited to Interview

curl -s -X PATCH http://localhost:5501/api/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Invited to Interview"}' | jq .
  
CASE 4: Application Declined

curl -s -X PATCH http://localhost:5501/api/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Application Declined"}' | jq .

CASE 5: View application status on job list 

curl -s "http://localhost:5501/api/jobs?userId=5" | jq '.jobs[0] | {job_id, title, application_id, application_status}'

CASE 6: Data Persistence

---- Try to stop the server and restart it.
---- Now run 

curl -s "http://localhost:5501/api/jobs?userId=5" | jq '.jobs[0] | {application_id, application_status}'