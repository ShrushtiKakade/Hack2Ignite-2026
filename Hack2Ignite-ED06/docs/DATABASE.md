# Database Design

The ED-06 database is the source of truth for every value that can change during normal application use.

## Core Tables

- `users`: Login identity, role, account status.
- `students`: Student-specific profile details linked to `users`.
- `mentors`: Mentor-specific details linked to `users`.
- `internships`: Internship records linked to students and assigned mentors.
- `weekly_reports`: Student weekly submissions linked to internships.
- `feedback`: Mentor comments and ratings linked to students, mentors, and optionally reports.
- `documents`: Uploaded document metadata linked to students and optionally internships.
- `risk_analysis`: Latest and historical risk calculation results linked to students.

## Main Relationships

```text
users
  |-- students
  |     |-- internships
  |           |-- weekly_reports
  |-- mentors

students -- feedback
mentors  -- feedback
students -- documents
students -- risk_analysis
```

## Dynamic Data Rule

Hardcoded values are allowed only for fixed labels such as role names, page titles, button text, and status options.

Changing values must come from database/API queries, including:

- Student names
- Mentor names
- Companies
- Internship dates and status
- Weekly reports
- Feedback
- Dashboard counts
- Progress percentages
- Risk scores and risk levels

## Suggested Progress Formula

The backend can start with this simple formula:

```text
progress = approved_reports / expected_reports * 100
```

For an MVP, `expected_reports` can be calculated from internship duration in weeks. Later it can include task completion, hours, and mentor ratings.

## Suggested Risk Formula

Start with a rule-based score:

```text
total_score = (report_score + task_score + mentor_score + hours_score) / 4
```

Suggested levels:

- `ON_TRACK`: total score >= 70
- `NEEDS_ATTENTION`: total score >= 45 and < 70
- `AT_RISK`: total score < 45

Risk should be recalculated when:

- A student submits a report
- A mentor approves a report
- A mentor requests changes
- A mentor submits feedback
