package com.ed06.smartinternship.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_reports")
public class WeeklyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "internship_id", nullable = false)
    private Long internshipId;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "tasks_completed", nullable = false)
    private String tasksCompleted;

    @Column(nullable = false)
    private String description;

    @Column(name = "hours_worked", nullable = false)
    private BigDecimal hoursWorked;

    @Column(name = "problems_faced")
    private String problemsFaced;

    @Column(name = "next_week_plan")
    private String nextWeekPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public enum Status {
        PENDING,
        APPROVED,
        CHANGES_REQUESTED
    }

    public Long getId() {
        return id;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public Integer getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }

    public String getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(String tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(BigDecimal hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    public String getProblemsFaced() {
        return problemsFaced;
    }

    public void setProblemsFaced(String problemsFaced) {
        this.problemsFaced = problemsFaced;
    }

    public String getNextWeekPlan() {
        return nextWeekPlan;
    }

    public void setNextWeekPlan(String nextWeekPlan) {
        this.nextWeekPlan = nextWeekPlan;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
} 