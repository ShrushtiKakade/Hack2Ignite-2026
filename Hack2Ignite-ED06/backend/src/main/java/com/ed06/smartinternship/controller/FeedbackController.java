package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.Feedback;
import com.ed06.smartinternship.repository.FeedbackRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    @GetMapping("/{id}")
    public Feedback getFeedbackById(@PathVariable Long id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        if (feedback.getFeedbackType() == null) {
            feedback.setFeedbackType(Feedback.FeedbackType.GENERAL);
        }

        return feedbackRepository.save(feedback);
    }
}