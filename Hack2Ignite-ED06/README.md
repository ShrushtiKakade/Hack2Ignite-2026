# Smart Internship System - ED-06

Smart Internship System is a database-driven internship monitoring platform for students, mentors, and admins.

## Problem Statement

Colleges need a reliable way to track student internships, weekly progress, mentor review, submitted documents, and risk signals in one place.

## Our Solution

The system stores all changing information in MySQL and exposes it through a Spring Boot REST API. The frontend will fetch real database data for dashboards, forms, reports, progress, and risk analysis.

## Features

- Role-based login for Student, Mentor, and Admin users
- Student profile and internship management
- Weekly report submission and review workflow
- Mentor approval, change requests, feedback, and ratings
- Admin dashboard statistics from database records
- Rule-based progress and risk analysis foundation
- Document metadata storage for uploaded internship files

## Technology Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap, Chart.js
- Backend: Java, Spring Boot
- Database: MySQL
- AI/Risk: Rule-based analyzer first, AI API later if time permits

## Project Structure

```text
Hack2Ignite-ED06/
  frontend/
  backend/
  database/
    schema.sql
  docs/
    DATABASE.md
  screenshots/
  README.md
```

## Database Setup

1. Open MySQL Workbench or MySQL CLI.
2. Run the script in `database/schema.sql`.
3. The script creates the `smart_internship` database, tables, relationships, indexes, and demo records.

CLI example:

```bash
mysql -u root -p < database/schema.sql
```

## Demo Accounts

These records are inserted by `schema.sql`.

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@ed06.local | admin123 |
| Mentor | rahul.mentor@ed06.local | mentor123 |
| Mentor | neha.mentor@ed06.local | mentor123 |
| Student | chaitanya@student.ed06.local | student123 |
| Student | riya@student.ed06.local | student123 |
| Student | aman@student.ed06.local | student123 |

Note: Demo passwords are plain text only for the first hackathon database milestone. The Spring Boot authentication layer should hash passwords before real use.

## Next Development Step

Create the Spring Boot backend and connect it to this database using the Controller -> Service -> Repository flow.

## Future Scope

- Password hashing with Spring Security
- JWT/session-based authentication
- File upload storage for documents
- More detailed analytics and charts
- AI API integration for richer risk explanations
- Deployment with hosted backend and database

## Team Members

- Add team member names here
