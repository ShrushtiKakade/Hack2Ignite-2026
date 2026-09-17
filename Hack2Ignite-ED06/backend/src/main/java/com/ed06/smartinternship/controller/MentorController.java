package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.Mentor;
import com.ed06.smartinternship.repository.MentorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorRepository mentorRepository;

    public MentorController(MentorRepository mentorRepository) {
        this.mentorRepository = mentorRepository;
    }

    @GetMapping
    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    @GetMapping("/{id}")
    public Mentor getMentorById(@PathVariable Long id) {
        return mentorRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Mentor createMentor(@RequestBody Mentor mentor) {
        return mentorRepository.save(mentor);
    }
}