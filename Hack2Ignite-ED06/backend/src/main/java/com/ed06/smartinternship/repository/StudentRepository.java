package com.ed06.smartinternship.repository;

import com.ed06.smartinternship.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}