package com.ed06.smartinternship.repository;

import com.ed06.smartinternship.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}