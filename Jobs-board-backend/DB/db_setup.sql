
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Trainee', 'Mentor', 'Staff', 'Admin');
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('Pending', 'Approved');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
user_id SERIAL PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
user_role user_role NOT NULL DEFAULT 'Trainee',
description TEXT,
account_status user_status NOT NULL DEFAULT 'Pending',
mentor_id INT REFERENCES users(user_id),
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_type_enum') THEN
        CREATE TYPE employment_type_enum AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    employment_type employment_type_enum NOT NULL,
    exp_level VARCHAR(500),
    partner_name VARCHAR(500),
    tech_stack VARCHAR(255),
    source VARCHAR(255),
    external_job_id VARCHAR(255),
    apply_url VARCHAR(255) NOT NULL,
    active_from TIMESTAMPTZ,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NEW
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS location_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS api_source TEXT DEFAULT 'DevitJobs',
  ADD COLUMN IF NOT EXISTS salary_min INT,
  ADD COLUMN IF NOT EXISTS salary_max INT,
  ADD COLUMN IF NOT EXISTS is_star_employer BOOLEAN DEFAULT FALSE;

-- application_status enum + applications table
DO $$ BEGIN

    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Interested';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Application Submitted';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Initial Screening';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS '1st Round Interview';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS '2nd Round Interview';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Offer Received';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Application Declined';
    -- IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status_enum') THEN
    --     CREATE TYPE application_status_enum AS ENUM (
    --         'Interested',
    --         'Application Started',
    --         'Application Submitted',
    --         'Invited to Interview',
    --         'Application Declined',
    --         'Offer Received'
    --     );
    -- END IF;
END $$;

CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    job_id INT NOT NULL REFERENCES jobs (job_id) ON DELETE CASCADE,
    status application_status_enum NOT NULL DEFAULT 'Application Started',
    created_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS star_companies (
  company_name TEXT PRIMARY KEY,
  marked_by INTEGER REFERENCES users(user_id),
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job comments table for mentor-trainee communication on specific applications
CREATE TABLE IF NOT EXISTS job_comments (
    comment_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_comments_application ON job_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_job_comments_created_at ON job_comments(created_at DESC);

ALTER TABLE job_comments
DROP CONSTRAINT IF EXISTS job_comments_application_id_fkey;

ALTER TABLE job_comments
ADD CONSTRAINT job_comments_application_id_fkey
FOREIGN KEY (application_id)
REFERENCES applications(application_id)
ON DELETE CASCADE;