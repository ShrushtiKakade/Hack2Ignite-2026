package com.ed06.smartinternship.repository;

import com.ed06.smartinternship.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}