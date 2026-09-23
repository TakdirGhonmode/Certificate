package in.ProjectS.StudentManagementSystem.Service;

import in.ProjectS.StudentManagementSystem.Dto.AdminStudentResponseDTO;
import in.ProjectS.StudentManagementSystem.Dto.DashboardStatsDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentRequestDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {
    StudentResponseDTO createStudent(StudentRequestDTO dto);

    List<StudentResponseDTO> getAllStudents();

    StudentResponseDTO getStudentById(Long id);

    StudentResponseDTO updateStudent(Long id, StudentRequestDTO dto);

    Boolean deleteStudentR(Long id);

    Boolean deleteStudentSoft(Long id);

    List<AdminStudentResponseDTO> getAllStudentsForAdmin();

    DashboardStatsDTO getDashboardStats();
}
