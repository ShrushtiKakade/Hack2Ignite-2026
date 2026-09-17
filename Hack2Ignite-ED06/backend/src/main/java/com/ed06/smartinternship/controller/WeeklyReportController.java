package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.WeeklyReport;
import com.ed06.smartinternship.repository.WeeklyReportRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/weekly-reports")
public class WeeklyReportController {

    private final WeeklyReportRepository weeklyReportRepository;

    public WeeklyReportController(WeeklyReportRepository weeklyReportRepository) {
        this.weeklyReportRepository = weeklyReportRepository;
    }

    @GetMapping
    public List<WeeklyReport> getAllReports() {
        return weeklyReportRepository.findAll();
    }

    @GetMapping("/{id}")
    public WeeklyReport getReportById(@PathVariable Long id) {
        return weeklyReportRepository.findById(id).orElse(null);
    }

    @PostMapping
    public WeeklyReport createReport(@RequestBody WeeklyReport report) {

        if (report.getStatus() == null) {
            report.setStatus(WeeklyReport.Status.PENDING);
        }

        if (report.getSubmittedAt() == null) {
            report.setSubmittedAt(LocalDateTime.now());
        }

        return weeklyReportRepository.save(report);
    }

    @PutMapping("/{id}/status")
    public WeeklyReport updateStatus(
            @PathVariable Long id,
            @RequestParam WeeklyReport.Status status) {

        WeeklyReport report = weeklyReportRepository.findById(id).orElse(null);

        if (report == null) {
            return null;
        }

        report.setStatus(status);

        if (status == WeeklyReport.Status.APPROVED ||
            status == WeeklyReport.Status.CHANGES_REQUESTED) {

            report.setReviewedAt(LocalDateTime.now());
        }

        return weeklyReportRepository.save(report);
    }
}
