package in.ProjectS.StudentManagementSystem.Controller;

import in.ProjectS.StudentManagementSystem.Dto.AdminStudentResponseDTO;
import in.ProjectS.StudentManagementSystem.Service.StudentServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStudentController {
    private final StudentServiceImpl studentService;

    public AdminStudentController(StudentServiceImpl studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<AdminStudentResponseDTO>> getAllStudentsForAdmin() {

        List<AdminStudentResponseDTO> students =
                studentService.getAllStudentsForAdmin();

        return ResponseEntity.ok(students);
    }
}
