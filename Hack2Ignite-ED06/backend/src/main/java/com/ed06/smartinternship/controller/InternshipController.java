package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.Internship;
import com.ed06.smartinternship.repository.InternshipRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    private final InternshipRepository internshipRepository;

    public InternshipController(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    @GetMapping("/{id}")
    public Internship getInternshipById(@PathVariable Long id) {
        return internshipRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Internship createInternship(@RequestBody Internship internship) {
        return internshipRepository.save(internship);
    }
}