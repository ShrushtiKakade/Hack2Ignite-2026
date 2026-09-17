package com.ed06.smartinternship.repository;

import com.ed06.smartinternship.entity.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
}