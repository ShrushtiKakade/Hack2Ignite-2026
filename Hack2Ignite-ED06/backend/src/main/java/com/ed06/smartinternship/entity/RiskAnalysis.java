package com.ed06.smartinternship.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_analysis")
public class RiskAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "report_score", nullable = false)
    private BigDecimal reportScore;

    @Column(name = "task_score", nullable = false)
    private BigDecimal taskScore;

    @Column(name = "mentor_score", nullable = false)
    private BigDecimal mentorScore;

    @Column(name = "hours_score", nullable = false)
    private BigDecimal hoursScore;

    @Column(name = "total_score", nullable = false)
    private BigDecimal totalScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private String recommendation;

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;

    public enum RiskLevel {
        ON_TRACK,
        NEEDS_ATTENTION,
        AT_RISK
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public BigDecimal getReportScore() {
        return reportScore;
    }

    public void setReportScore(BigDecimal reportScore) {
        this.reportScore = reportScore;
    }

    public BigDecimal getTaskScore() {
        return taskScore;
    }

    public void setTaskScore(BigDecimal taskScore) {
        this.taskScore = taskScore;
    }

    public BigDecimal getMentorScore() {
        return mentorScore;
    }

    public void setMentorScore(BigDecimal mentorScore) {
        this.mentorScore = mentorScore;
    }

    public BigDecimal getHoursScore() {
        return hoursScore;
    }

    public void setHoursScore(BigDecimal hoursScore) {
        this.hoursScore = hoursScore;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(BigDecimal totalScore) {
        this.totalScore = totalScore;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}