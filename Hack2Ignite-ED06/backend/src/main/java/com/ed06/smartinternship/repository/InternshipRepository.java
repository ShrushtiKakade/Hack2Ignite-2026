package com.ed06.smartinternship.repository;

import com.ed06.smartinternship.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
}