
const API = "http://localhost:8080/api";


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const students =
            await fetch(`${API}/students`).then(r => r.json());

        const mentors =
            await fetch(`${API}/mentors`).then(r => r.json());

        const internships =
            await fetch(`${API}/internships`).then(r => r.json());

        const reports =
            await fetch(`${API}/weekly-reports`).then(r => r.json());

        const risks =
            await fetch(`${API}/risk-analysis`).then(r => r.json());


        document.getElementById("studentCount").textContent =
            students.length;

        document.getElementById("mentorCount").textContent =
            mentors.length;

        document.getElementById("internshipCount").textContent =
            internships.length;

        document.getElementById("reportCount").textContent =
            reports.length;


        let onTrack = 0;
        let attention = 0;
        let atRisk = 0;


        risks.forEach(risk => {

            if (risk.riskLevel === "ON_TRACK") {
                onTrack++;
            }

            if (risk.riskLevel === "NEEDS_ATTENTION") {
                attention++;
            }

            if (risk.riskLevel === "AT_RISK") {
                atRisk++;
            }

        });


        document.getElementById("riskOverview").innerHTML = `

            <p>
                🟢 On Track:
                <strong>${onTrack}</strong>
            </p>

            <p>
                🟡 Needs Attention:
                <strong>${attention}</strong>
            </p>

            <p>
                🔴 At Risk:
                <strong>${atRisk}</strong>
            </p>

        `;

    } catch (error) {

        console.error("Dashboard error:", error);

    }
}


/* =========================================================
   STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const students =
            await fetch(`${API}/students`)
                .then(response => response.json());


        const table =
            document.getElementById("studentTable");


        table.innerHTML = "";


        students.forEach(student => {

            table.innerHTML += `

                <tr>

                    <td>${student.id}</td>

                    <td>${student.userId}</td>

                    <td>${student.college}</td>

                    <td>${student.course}</td>

                    <td>${student.yearOfStudy}</td>

                    <td>${student.phone || "-"}</td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Students error:", error);

    }
}


/* =========================================================
   INTERNSHIPS
========================================================= */

async function loadInternships() {

    try {

        const internships =
            await fetch(`${API}/internships`)
                .then(response => response.json());


        const table =
            document.getElementById("internshipTable");


        table.innerHTML = "";


        internships.forEach(internship => {

            table.innerHTML += `

                <tr>

                    <td>${internship.id}</td>

                    <td>${internship.studentId}</td>

                    <td>${internship.company}</td>

                    <td>${internship.roleTitle}</td>

                    <td>${internship.internshipType}</td>

                    <td>

                        <span class="badge">
                            ${internship.status}
                        </span>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Internships error:", error);

    }
}


/* =========================================================
   WEEKLY REPORTS
========================================================= */

async function loadReports() {

    try {

        const reports =
            await fetch(`${API}/weekly-reports`)
                .then(response => response.json());


        const table =
            document.getElementById("reportTable");


        table.innerHTML = "";


        reports.forEach(report => {

            let actionButtons = "";


            if (report.status === "PENDING") {

                actionButtons = `

                    <button
                        class="primary-btn"
                        onclick="updateReportStatus(
                            ${report.id},
                            'APPROVED'
                        )">

                        ✓ Approve

                    </button>


                    <button
                        class="secondary-btn"
                        onclick="updateReportStatus(
                            ${report.id},
                            'CHANGES_REQUESTED'
                        )">

                        ↻ Request Changes

                    </button>

                `;

            } else {

                actionButtons = `

                    <span class="badge">
                        Reviewed
                    </span>

                `;

            }


            table.innerHTML += `

                <tr>

                    <td>${report.id}</td>

                    <td>${report.internshipId}</td>

                    <td>${report.weekNumber}</td>

                    <td>${report.hoursWorked}</td>

                    <td>

                        <span class="badge">
                            ${report.status}
                        </span>

                    </td>

                    <td>

                        ${actionButtons}

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Reports error:", error);

    }
}


/* =========================================================
   REPORT REVIEW
========================================================= */

async function updateReportStatus(reportId, status) {

    const message =
        status === "APPROVED"
            ? "Are you sure you want to approve this report?"
            : "Request changes for this report?";


    if (!confirm(message)) {

        return;

    }


    try {

        const response = await fetch(

            `${API}/weekly-reports/${reportId}/status?status=${status}`,

            {
                method: "PUT"
            }

        );


        if (!response.ok) {

            throw new Error(
                "Failed to update report status"
            );

        }


        if (status === "APPROVED") {

            alert(
                "✅ Report approved successfully!"
            );

        } else {

            alert(
                "🔄 Changes requested successfully!"
            );

        }


        await loadReports();

        await loadRiskAnalysis();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Report review error:",
            error
        );


        alert(
            "❌ Failed to update report status."
        );

    }
}


/* =========================================================
   RISK ANALYSIS
========================================================= */

async function loadRiskAnalysis() {

    try {

        const students =
            await fetch(`${API}/students`)
                .then(response => response.json());


        const internships =
            await fetch(`${API}/internships`)
                .then(response => response.json());


        const reports =
            await fetch(`${API}/weekly-reports`)
                .then(response => response.json());


        const feedback =
            await fetch(`${API}/feedback`)
                .then(response => response.json());


        const container =
            document.getElementById("riskCards");


        container.innerHTML = "";


        /*
         * IMPORTANT:
         *
         * weekly_reports contains internshipId.
         *
         * internships contains studentId.
         *
         * Therefore:
         *
         * Student
         *    ↓
         * Internship
         *    ↓
         * Weekly Report
         *
         * We use this relationship to calculate
         * each student's progress.
         */


        students.forEach(student => {


            /* Find student's internships */

            const studentInternships =
                internships.filter(
                    internship =>
                        Number(internship.studentId) ===
                        Number(student.id)
                );


            /* Get internship IDs */

            const internshipIds =
                studentInternships.map(
                    internship =>
                        Number(internship.id)
                );


            /* Find reports belonging to student */

            const studentReports =
                reports.filter(
                    report =>
                        internshipIds.includes(
                            Number(report.internshipId)
                        )
                );


            /* Find feedback belonging to student */

            const studentFeedback =
                feedback.filter(
                    item =>
                        Number(item.studentId) ===
                        Number(student.id)
                );


            /* Starting score */

            let score = 100;


            /* ---------------- REPORT ACTIVITY ---------------- */

            if (studentReports.length === 0) {

                score -= 40;

            } else if (studentReports.length === 1) {

                score -= 20;

            }


            /* ---------------- PENDING REPORTS ---------------- */

            const pendingReports =
                studentReports.filter(
                    report =>
                        report.status === "PENDING"
                ).length;


            score -= pendingReports * 10;


            /* ---------------- APPROVED REPORTS ---------------- */

            const approvedReports =
                studentReports.filter(
                    report =>
                        report.status === "APPROVED"
                ).length;


            score += approvedReports * 5;


            /* ---------------- CHANGES REQUESTED ---------------- */

            const changesRequested =
                studentReports.filter(
                    report =>
                        report.status === "CHANGES_REQUESTED"
                ).length;


            score -= changesRequested * 15;


            /* ---------------- MENTOR FEEDBACK ---------------- */

            studentFeedback.forEach(item => {

                if (item.rating) {

                    score +=
                        (Number(item.rating) - 3) * 5;

                }

            });


            /* Keep score between 0 and 100 */

            score =
                Math.max(
                    0,
                    Math.min(100, score)
                );


            /* ---------------- RISK LEVEL ---------------- */

            let riskLevel;

            let className;

            let reason;

            let recommendation;


            if (score >= 70) {

                riskLevel = "ON_TRACK";

                className = "on-track";


                reason =
                    "Student is submitting reports and maintaining satisfactory internship progress.";


                recommendation =
                    "Continue the current progress and maintain regular weekly reporting.";

            }


            else if (score >= 45) {

                riskLevel =
                    "NEEDS_ATTENTION";

                className =
                    "attention";


                reason =
                    "Some progress indicators require mentor attention.";


                recommendation =
                    "Mentor should review recent reports and provide additional guidance.";

            }


            else {

                riskLevel =
                    "AT_RISK";

                className =
                    "at-risk";


                reason =
                    "Low reporting activity or negative progress indicators suggest possible internship difficulties.";


                recommendation =
                    "Mentor should contact the student and review internship progress immediately.";

            }


            /* ---------------- DISPLAY CARD ---------------- */

            container.innerHTML += `

                <div class="risk-card ${className}">

                    <h3>
                        Student ${student.id}
                    </h3>


                    <p>

                        <strong>Risk:</strong>

                        ${riskLevel}

                    </p>


                    <p>

                        <strong>Progress Score:</strong>

                        ${score}

                    </p>


                    <p>

                        <strong>Internships:</strong>

                        ${studentInternships.length}

                    </p>


                    <p>

                        <strong>Reports:</strong>

                        ${studentReports.length}

                    </p>


                    <p>

                        <strong>Approved:</strong>

                        ${approvedReports}

                    </p>


                    <p>

                        <strong>Feedback:</strong>

                        ${studentFeedback.length}

                    </p>


                    <p>

                        <strong>Reason:</strong>

                        ${reason}

                    </p>


                    <p>

                        <strong>Recommendation:</strong>

                        ${recommendation}

                    </p>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Risk analysis error:",
            error
        );

    }

}


/* =========================================================
   FEEDBACK
========================================================= */

async function loadFeedback() {

    try {

        const feedback =
            await fetch(`${API}/feedback`)
                .then(response => response.json());


        const container =
            document.getElementById(
                "feedbackCards"
            );


        container.innerHTML = "";


        feedback.forEach(item => {

            container.innerHTML += `

                <div class="feedback-card">

                    <h3>
                        Student ${item.studentId}
                    </h3>


                    <p>

                        <strong>Mentor:</strong>

                        ${item.mentorId}

                    </p>


                    <p>

                        <strong>Report:</strong>

                        ${item.reportId || "-"}

                    </p>


                    <p>

                        ${item.comment}

                    </p>


                    <p>

                        ⭐ Rating:

                        ${item.rating || "Not rated"}

                    </p>


                    <span class="badge">

                        ${item.feedbackType}

                    </span>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Feedback error:",
            error
        );

    }

}


/* =========================================================
   DOCUMENTS
========================================================= */

async function loadDocuments() {

    try {

        const documents =
            await fetch(`${API}/documents`)
                .then(response => response.json());


        const table =
            document.getElementById(
                "documentTable"
            );


        table.innerHTML = "";


        documents.forEach(document => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${document.id}
                    </td>

                    <td>
                        ${document.studentId}
                    </td>

                    <td>
                        ${document.documentType}
                    </td>

                    <td>
                        ${document.fileName}
                    </td>

                    <td>
                        ${document.uploadedAt}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(
            "Documents error:",
            error
        );

    }

}


/* =========================================================
   ADD STUDENT
========================================================= */

function showAddStudentForm() {

    document.getElementById(
        "addStudentForm"
    ).style.display = "block";

}


function hideAddStudentForm() {

    document.getElementById(
        "addStudentForm"
    ).style.display = "none";

}


async function addStudent(event) {

    event.preventDefault();


    const studentData = {

        name:
            document.getElementById(
                "studentName"
            ).value,

        email:
            document.getElementById(
                "studentEmail"
            ).value,

        password:
            document.getElementById(
                "studentPassword"
            ).value,

        college:
            document.getElementById(
                "studentCollege"
            ).value,

        course:
            document.getElementById(
                "studentCourse"
            ).value,

        yearOfStudy:
            Number(
                document.getElementById(
                    "studentYear"
                ).value
            ),

        phone:
            document.getElementById(
                "studentPhone"
            ).value

    };


    try {

        const response =
            await fetch(
                `${API}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            studentData
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add student"
            );

        }


        const student =
            await response.json();


        alert(
            `Student added successfully! Student ID: ${student.id}`
        );


        document
            .querySelector(
                "#addStudentForm form"
            )
            .reset();


        hideAddStudentForm();


        await loadStudents();

        await loadDashboard();

        await loadRiskAnalysis();


    } catch (error) {

        console.error(
            "Add student error:",
            error
        );


        alert(
            "Failed to add student. Please check the backend."
        );

    }

}


/* =========================================================
   ADD INTERNSHIP
========================================================= */

function showAddInternshipForm() {

    document.getElementById(
        "addInternshipForm"
    ).style.display = "block";

}


function hideAddInternshipForm() {

    document.getElementById(
        "addInternshipForm"
    ).style.display = "none";

}


async function addInternship(event) {

    event.preventDefault();


    const internshipData = {

        studentId:
            Number(
                document.getElementById(
                    "internshipStudentId"
                ).value
            ),


        mentorId:
            document.getElementById(
                "internshipMentorId"
            ).value

                ? Number(
                    document.getElementById(
                        "internshipMentorId"
                    ).value
                )

                : null,


        company:
            document.getElementById(
                "internshipCompany"
            ).value,


        roleTitle:
            document.getElementById(
                "internshipRole"
            ).value,


        internshipType:
            document.getElementById(
                "internshipType"
            ).value,


        startDate:
            document.getElementById(
                "internshipStartDate"
            ).value,


        endDate:
            document.getElementById(
                "internshipEndDate"
            ).value,


        status:
            document.getElementById(
                "internshipStatus"
            ).value

    };


    try {

        const response =
            await fetch(
                `${API}/internships`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            internshipData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add internship"
            );

        }


        const internship =
            await response.json();


        alert(
            `Internship added successfully! Internship ID: ${internship.id}`
        );


        document
            .querySelector(
                "#addInternshipForm form"
            )
            .reset();


        hideAddInternshipForm();


        await loadInternships();

        await loadDashboard();

        await loadRiskAnalysis();


    } catch (error) {

        console.error(
            "Add internship error:",
            error
        );


        alert(
            "Failed to add internship. Please check the backend."
        );

    }

}


/* =========================================================
   SUBMIT WEEKLY REPORT
========================================================= */

function showAddReportForm() {

    document.getElementById(
        "addReportForm"
    ).style.display = "block";

}


function hideAddReportForm() {

    document.getElementById(
        "addReportForm"
    ).style.display = "none";

}


async function addReport(event) {

    event.preventDefault();


    const reportData = {

        internshipId:
            Number(
                document.getElementById(
                    "reportInternshipId"
                ).value
            ),


        weekNumber:
            Number(
                document.getElementById(
                    "reportWeekNumber"
                ).value
            ),


        tasksCompleted:
            document.getElementById(
                "reportTasksCompleted"
            ).value,


        description:
            document.getElementById(
                "reportDescription"
            ).value,


        hoursWorked:
            Number(
                document.getElementById(
                    "reportHoursWorked"
                ).value
            ),


        problemsFaced:
            document.getElementById(
                "reportProblemsFaced"
            ).value,


        nextWeekPlan:
            document.getElementById(
                "reportNextWeekPlan"
            ).value

    };


    try {

        const response =
            await fetch(
                `${API}/weekly-reports`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            reportData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to submit report"
            );

        }


        const report =
            await response.json();


        alert(
            `Weekly report submitted successfully! Report ID: ${report.id}`
        );


        document
            .querySelector(
                "#addReportForm form"
            )
            .reset();


        hideAddReportForm();


        await loadReports();

        await loadRiskAnalysis();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Add report error:",
            error
        );


        alert(
            "Failed to submit report. Please check the backend."
        );

    }

}


/* =========================================================
   ADD FEEDBACK
========================================================= */

function showFeedbackForm() {

    document.getElementById(
        "feedbackForm"
    ).style.display = "block";

}


function hideFeedbackForm() {

    document.getElementById(
        "feedbackForm"
    ).style.display = "none";

}


async function addFeedback(event) {

    event.preventDefault();


    const feedbackData = {

        studentId:
            Number(
                document.getElementById(
                    "feedbackStudentId"
                ).value
            ),


        mentorId:
            Number(
                document.getElementById(
                    "feedbackMentorId"
                ).value
            ),


        reportId:
            document.getElementById(
                "feedbackReportId"
            ).value

                ? Number(
                    document.getElementById(
                        "feedbackReportId"
                    ).value
                )

                : null,


        comment:
            document.getElementById(
                "feedbackComment"
            ).value,


        rating:
            document.getElementById(
                "feedbackRating"
            ).value

                ? Number(
                    document.getElementById(
                        "feedbackRating"
                    ).value
                )

                : null,


        feedbackType:
            document.getElementById(
                "feedbackType"
            ).value

    };


    try {

        const response =
            await fetch(
                `${API}/feedback`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            feedbackData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add feedback"
            );

        }


        const feedback =
            await response.json();


        alert(
            `✅ Feedback submitted successfully! Feedback ID: ${feedback.id}`
        );


        document
            .querySelector(
                "#feedbackForm form"
            )
            .reset();


        hideFeedbackForm();


        await loadFeedback();

        await loadRiskAnalysis();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Add feedback error:",
            error
        );


        alert(
            "❌ Failed to submit feedback. Please check the backend."
        );

    }

}


/* =========================================================
   LOAD EVERYTHING
========================================================= */

async function loadAllData() {

    await loadDashboard();

    await loadStudents();

    await loadInternships();

    await loadReports();

    await loadRiskAnalysis();

    await loadFeedback();

    await loadDocuments();

}


/* =========================================================
   START APPLICATION
========================================================= */

loadAllData();
