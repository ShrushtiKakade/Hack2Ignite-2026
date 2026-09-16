-- Smart Internship System - ED-06
-- MySQL schema for the first development milestone.

DROP DATABASE IF EXISTS smart_internship;
CREATE DATABASE smart_internship
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_internship;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('STUDENT', 'MENTOR', 'ADMIN') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  college VARCHAR(160) NOT NULL,
  course VARCHAR(120) NOT NULL,
  year_of_study TINYINT UNSIGNED NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT chk_students_year
    CHECK (year_of_study BETWEEN 1 AND 6)
);

CREATE TABLE mentors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  department VARCHAR(120) NOT NULL,
  designation VARCHAR(120),
  phone VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_mentors_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE internships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  mentor_id BIGINT,
  company VARCHAR(160) NOT NULL,
  role_title VARCHAR(140) NOT NULL,
  internship_type ENUM('ONSITE', 'REMOTE', 'HYBRID') NOT NULL DEFAULT 'ONSITE',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_internships_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_internships_mentor
    FOREIGN KEY (mentor_id) REFERENCES mentors(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_internships_dates
    CHECK (end_date >= start_date)
);

CREATE TABLE weekly_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  internship_id BIGINT NOT NULL,
  week_number INT UNSIGNED NOT NULL,
  tasks_completed TEXT NOT NULL,
  description TEXT NOT NULL,
  hours_worked DECIMAL(5,2) NOT NULL,
  problems_faced TEXT,
  next_week_plan TEXT,
  status ENUM('PENDING', 'APPROVED', 'CHANGES_REQUESTED') NOT NULL DEFAULT 'PENDING',
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_weekly_reports_internship
    FOREIGN KEY (internship_id) REFERENCES internships(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_weekly_reports_internship_week
    UNIQUE (internship_id, week_number),
  CONSTRAINT chk_weekly_reports_week
    CHECK (week_number BETWEEN 1 AND 52),
  CONSTRAINT chk_weekly_reports_hours
    CHECK (hours_worked >= 0 AND hours_worked <= 168)
);

CREATE TABLE feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  mentor_id BIGINT NOT NULL,
  report_id BIGINT,
  comment TEXT NOT NULL,
  rating TINYINT UNSIGNED,
  feedback_type ENUM('GENERAL', 'REPORT_REVIEW', 'CHANGE_REQUEST') NOT NULL DEFAULT 'GENERAL',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_feedback_mentor
    FOREIGN KEY (mentor_id) REFERENCES mentors(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_feedback_report
    FOREIGN KEY (report_id) REFERENCES weekly_reports(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_feedback_rating
    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
);

CREATE TABLE documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  internship_id BIGINT,
  document_type ENUM('OFFER_LETTER', 'INTERNSHIP_LETTER', 'COMPLETION_CERTIFICATE', 'OTHER') NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_documents_internship
    FOREIGN KEY (internship_id) REFERENCES internships(id)
    ON DELETE SET NULL
);

CREATE TABLE risk_analysis (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  report_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  task_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  mentor_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  hours_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  risk_level ENUM('ON_TRACK', 'NEEDS_ATTENTION', 'AT_RISK') NOT NULL,
  reason TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  analyzed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_risk_analysis_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT chk_risk_report_score
    CHECK (report_score BETWEEN 0 AND 100),
  CONSTRAINT chk_risk_task_score
    CHECK (task_score BETWEEN 0 AND 100),
  CONSTRAINT chk_risk_mentor_score
    CHECK (mentor_score BETWEEN 0 AND 100),
  CONSTRAINT chk_risk_hours_score
    CHECK (hours_score BETWEEN 0 AND 100),
  CONSTRAINT chk_risk_total_score
    CHECK (total_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_internships_student ON internships(student_id);
CREATE INDEX idx_internships_mentor ON internships(mentor_id);
CREATE INDEX idx_internships_status ON internships(status);
CREATE INDEX idx_weekly_reports_status ON weekly_reports(status);
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_mentor ON feedback(mentor_id);
CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_risk_analysis_student_date ON risk_analysis(student_id, analyzed_at);
CREATE INDEX idx_risk_analysis_level ON risk_analysis(risk_level);

INSERT INTO users (id, name, email, password, role) VALUES
  (1, 'System Admin', 'admin@ed06.local', 'admin123', 'ADMIN'),
  (2, 'Rahul Sharma', 'rahul.mentor@ed06.local', 'mentor123', 'MENTOR'),
  (3, 'Neha Patil', 'neha.mentor@ed06.local', 'mentor123', 'MENTOR'),
  (4, 'Chaitanya Kulkarni', 'chaitanya@student.ed06.local', 'student123', 'STUDENT'),
  (5, 'Riya Mehta', 'riya@student.ed06.local', 'student123', 'STUDENT'),
  (6, 'Aman Verma', 'aman@student.ed06.local', 'student123', 'STUDENT');

INSERT INTO mentors (id, user_id, department, designation, phone) VALUES
  (1, 2, 'Computer Engineering', 'Assistant Professor', '9876500001'),
  (2, 3, 'Information Technology', 'Associate Professor', '9876500002');

INSERT INTO students (id, user_id, college, course, year_of_study, phone) VALUES
  (1, 4, 'ABC College of Engineering', 'Computer Engineering', 2, '9876500101'),
  (2, 5, 'ABC College of Engineering', 'Information Technology', 3, '9876500102'),
  (3, 6, 'ABC College of Engineering', 'Computer Engineering', 2, '9876500103');

INSERT INTO internships
  (id, student_id, mentor_id, company, role_title, internship_type, start_date, end_date, status)
VALUES
  (1, 1, 1, 'ABC Technologies', 'Java Developer Intern', 'HYBRID', '2026-08-01', '2026-09-30', 'ACTIVE'),
  (2, 2, 1, 'TCS', 'Web Development Intern', 'REMOTE', '2026-08-05', '2026-10-05', 'ACTIVE'),
  (3, 3, 2, 'XYZ Solutions', 'Data Analyst Intern', 'ONSITE', '2026-08-01', '2026-09-30', 'ACTIVE');

INSERT INTO weekly_reports
  (id, internship_id, week_number, tasks_completed, description, hours_worked, problems_faced, next_week_plan, status, reviewed_at)
VALUES
  (1, 1, 1, 'Created login API; Connected MySQL', 'Built authentication endpoints and tested database connectivity.', 32.00, 'Initial CORS setup issue.', 'Create profile APIs.', 'APPROVED', '2026-08-09 10:30:00'),
  (2, 1, 2, 'Created student profile module', 'Added profile save and fetch flow through backend APIs.', 34.00, 'Validation handling needed improvement.', 'Build internship registration.', 'APPROVED', '2026-08-16 11:00:00'),
  (3, 1, 3, 'Built weekly report API', 'Implemented report submission and pending status workflow.', 30.00, 'Minor request payload mismatch.', 'Integrate mentor dashboard.', 'PENDING', NULL),
  (4, 2, 1, 'Designed UI pages; Added dashboard cards', 'Created responsive dashboard layout and started API integration.', 28.00, 'Chart labels required cleanup.', 'Connect reports table.', 'APPROVED', '2026-08-12 15:20:00'),
  (5, 2, 2, 'Integrated reports list', 'Connected reports page to backend and improved empty states.', 26.00, 'No major blockers.', 'Add document upload UI.', 'CHANGES_REQUESTED', '2026-08-19 16:40:00'),
  (6, 3, 1, 'Collected requirements', 'Reviewed company data and prepared analysis notes.', 14.00, 'Limited access to datasets.', 'Start weekly analysis tasks.', 'PENDING', NULL);

INSERT INTO feedback
  (student_id, mentor_id, report_id, comment, rating, feedback_type)
VALUES
  (1, 1, 1, 'Good start. Authentication flow is clear and tested.', 4, 'REPORT_REVIEW'),
  (1, 1, 2, 'Profile module works well. Add better validation messages.', 4, 'REPORT_REVIEW'),
  (2, 1, 5, 'Please provide more details about API testing and screenshots.', 3, 'CHANGE_REQUEST'),
  (3, 2, 6, 'Report needs more implementation detail and consistent hours.', 2, 'REPORT_REVIEW');

INSERT INTO documents
  (student_id, internship_id, document_type, file_name, file_path)
VALUES
  (1, 1, 'OFFER_LETTER', 'chaitanya-offer-letter.pdf', '/uploads/documents/chaitanya-offer-letter.pdf'),
  (2, 2, 'OFFER_LETTER', 'riya-offer-letter.pdf', '/uploads/documents/riya-offer-letter.pdf'),
  (3, 3, 'INTERNSHIP_LETTER', 'aman-internship-letter.pdf', '/uploads/documents/aman-internship-letter.pdf');

INSERT INTO risk_analysis
  (student_id, report_score, task_score, mentor_score, hours_score, total_score, risk_level, reason, recommendation)
VALUES
  (1, 75.00, 80.00, 80.00, 78.00, 78.25, 'ON_TRACK', 'Reports are regular and mentor ratings are positive.', 'Maintain current weekly reporting and continue improving validation quality.'),
  (2, 60.00, 65.00, 60.00, 62.00, 61.75, 'NEEDS_ATTENTION', 'One report requires changes and recent weekly hours are decreasing.', 'Student should update the requested report and discuss blockers with the mentor.'),
  (3, 35.00, 40.00, 40.00, 35.00, 37.50, 'AT_RISK', 'Low report submission, low weekly hours, and weak mentor feedback.', 'Mentor should contact the student and create a recovery plan.');
