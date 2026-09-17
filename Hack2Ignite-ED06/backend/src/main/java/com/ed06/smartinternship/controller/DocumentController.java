package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.Document;
import com.ed06.smartinternship.repository.DocumentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;

    public DocumentController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Document createDocument(@RequestBody Document document) {

        if (document.getUploadedAt() == null) {
            document.setUploadedAt(LocalDateTime.now());
        }

        return documentRepository.save(document);
    }
}