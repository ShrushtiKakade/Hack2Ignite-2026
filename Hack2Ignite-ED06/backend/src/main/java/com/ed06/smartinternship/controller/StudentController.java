package com.ed06.smartinternship.controller;

import com.ed06.smartinternship.entity.Student;
import com.ed06.smartinternship.entity.User;
import com.ed06.smartinternship.repository.StudentRepository;
import com.ed06.smartinternship.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentController(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Student createStudent(@RequestBody Map<String, Object> data) {

        // Create User
        User user = new User();

        user.setName((String) data.get("name"));
        user.setEmail((String) data.get("email"));
        user.setPassword((String) data.get("password"));
        user.setRole("STUDENT");

        User savedUser = userRepository.save(user);

        // Create Student
        Student student = new Student();

        student.setUserId(savedUser.getId());
        student.setCollege((String) data.get("college"));
        student.setCourse((String) data.get("course"));

        Number year = (Number) data.get("yearOfStudy");
        student.setYearOfStudy(year.intValue());

        student.setPhone((String) data.get("phone"));

        return studentRepository.save(student);
    }
}