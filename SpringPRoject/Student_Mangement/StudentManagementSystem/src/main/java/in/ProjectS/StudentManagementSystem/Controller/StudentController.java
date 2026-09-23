package in.ProjectS.StudentManagementSystem.Controller;

import in.ProjectS.StudentManagementSystem.Dto.DashboardStatsDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentRequestDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentResponseDTO;
import in.ProjectS.StudentManagementSystem.Service.StudentServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    private StudentServiceImpl studentService;

    public StudentController(StudentServiceImpl studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = studentService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(
            @Valid @RequestBody StudentRequestDTO dto) {

        StudentResponseDTO response =
                studentService.createStudent(dto);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {

        List<StudentResponseDTO> students =
                studentService.getAllStudents();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(
            @PathVariable Long id) {

        StudentResponseDTO student =
                studentService.getStudentById(id);

        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO dto) {

        StudentResponseDTO response =
                studentService.updateStudent(id, dto);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        Boolean isDeleted = studentService.deleteStudentR(id);

        if (!isDeleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok("Record deleted");
    }

    @PatchMapping("/soft-delete/{id}")
    public ResponseEntity<String> deleteStudentSoft(
            @PathVariable Long id) {

        Boolean isDeleted = studentService.deleteStudentSoft(id);

        if (!isDeleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok("Record is deleted");
    }
}
