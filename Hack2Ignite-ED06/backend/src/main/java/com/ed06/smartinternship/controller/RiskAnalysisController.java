package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.RiskAnalysis;
import com.ed06.smartinternship.repository.RiskAnalysisRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/risk-analysis")
public class RiskAnalysisController {

    private final RiskAnalysisRepository riskAnalysisRepository;

    public RiskAnalysisController(RiskAnalysisRepository riskAnalysisRepository) {
        this.riskAnalysisRepository = riskAnalysisRepository;
    }

    @GetMapping
    public List<RiskAnalysis> getAllRiskAnalysis() {
        return riskAnalysisRepository.findAll();
    }

    @GetMapping("/{id}")
    public RiskAnalysis getRiskAnalysisById(@PathVariable Long id) {
        return riskAnalysisRepository.findById(id).orElse(null);
    }

    @PostMapping
    public RiskAnalysis createRiskAnalysis(@RequestBody RiskAnalysis riskAnalysis) {
        if (riskAnalysis.getAnalyzedAt() == null) {
            riskAnalysis.setAnalyzedAt(LocalDateTime.now());
        }

        return riskAnalysisRepository.save(riskAnalysis);
    }
}
