package in.ProjectS.StudentManagementSystem.Service;

import in.ProjectS.StudentManagementSystem.Dto.ActivityDTO;
import in.ProjectS.StudentManagementSystem.Dto.AdminStudentResponseDTO;
import in.ProjectS.StudentManagementSystem.Dto.DashboardStatsDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentRequestDTO;
import in.ProjectS.StudentManagementSystem.Dto.StudentResponseDTO;
import in.ProjectS.StudentManagementSystem.Entity.Student;
import in.ProjectS.StudentManagementSystem.Exception.StudentNotFoundException;
import in.ProjectS.StudentManagementSystem.Repository.StudentRepo;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepo studentRepo;

    public StudentServiceImpl(StudentRepo studentRepo) {
        this.studentRepo = studentRepo;
    }

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO dto) {
        Student student = new Student();

        student.setRollNo(dto.getRollNo());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setBranch(dto.getBranch());
        student.setAge(dto.getAge());
        student.setMarks(dto.getMarks());

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        Student savedStudent = studentRepo.save(student);

        return new StudentResponseDTO(
                savedStudent.getId(),
                savedStudent.getRollNo(),
                savedStudent.getName(),
                savedStudent.getEmail(),
                savedStudent.getBranch(),
                savedStudent.getAge(),
                savedStudent.getMarks()
        );
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {
        List<Student> students = studentRepo.findByIsDeletedFalse();

        return students.stream()
                .map(student -> new StudentResponseDTO(
                        student.getId(),
                        student.getRollNo(),
                        student.getName(),
                        student.getEmail(),
                        student.getBranch(),
                        student.getAge(),
                        student.getMarks()
                ))
                .toList();
    }

    @Override
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + id
                        ));

        return new StudentResponseDTO(
                student.getId(),
                student.getRollNo(),
                student.getName(),
                student.getEmail(),
                student.getBranch(),
                student.getAge(),
                student.getMarks()
        );
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO dto) {
        Student student = studentRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with id: " + id
                        ));

        student.setRollNo(dto.getRollNo());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setBranch(dto.getBranch());
        student.setAge(dto.getAge());
        student.setMarks(dto.getMarks());

        student.setUpdatedAt(LocalDateTime.now());

        Student updatedStudent = studentRepo.save(student);

        return new StudentResponseDTO(
                updatedStudent.getId(),
                updatedStudent.getRollNo(),
                updatedStudent.getName(),
                updatedStudent.getEmail(),
                updatedStudent.getBranch(),
                updatedStudent.getAge(),
                updatedStudent.getMarks()
        );
    }

    @Override
    public Boolean deleteStudentR(Long id) {
        Boolean result = studentRepo.existsById(id);

        if (!result) {
            return false;
        }

        studentRepo.deleteById(id);

        return true;
    }

    @Override
    public Boolean deleteStudentSoft(Long id) {
        Optional<Student> existingStudent = studentRepo.findByIdAndIsDeletedFalse(id);

        if (existingStudent.isEmpty()) {
            return false;
        }

        Student studentToSave = existingStudent.get();

        studentToSave.setIsDeleted(true);
        studentToSave.setUpdatedAt(LocalDateTime.now());

        studentRepo.save(studentToSave);

        return true;
    }

    @Override
    public List<AdminStudentResponseDTO> getAllStudentsForAdmin() {
        List<Student> students = studentRepo.findAll();

        return students.stream()
                .map(student -> new AdminStudentResponseDTO(
                        student.getId(),
                        student.getRollNo(),
                        student.getName(),
                        student.getEmail(),
                        student.getBranch(),
                        student.getAge(),
                        student.getMarks(),
                        student.getIsDeleted(),
                        student.getCreatedAt(),
                        student.getUpdatedAt()
                ))
                .toList();
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        List<Student> allStudents = studentRepo.findAll();
        List<Student> activeStudents = allStudents.stream()
                .filter(s -> !Boolean.TRUE.equals(s.getIsDeleted()))
                .toList();

        long totalStudents = activeStudents.size();
        long deletedStudents = allStudents.stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsDeleted()))
                .count();

        // Branch Distribution
        Map<String, Long> branchDistribution = activeStudents.stream()
                .filter(s -> s.getBranch() != null && !s.getBranch().isBlank())
                .collect(Collectors.groupingBy(Student::getBranch, Collectors.counting()));

        long totalBranches = branchDistribution.keySet().size();

        // Average Marks
        double averageMarks = activeStudents.isEmpty() ? 0.0 :
                activeStudents.stream()
                        .mapToDouble(s -> s.getMarks() != null ? s.getMarks() : 0.0)
                        .average()
                        .orElse(0.0);

        averageMarks = Math.round(averageMarks * 100.0) / 100.0;

        // Grade Distribution
        Map<String, Long> gradeDistribution = new LinkedHashMap<>();
        gradeDistribution.put("A+", 0L);
        gradeDistribution.put("A", 0L);
        gradeDistribution.put("B", 0L);
        gradeDistribution.put("C", 0L);
        gradeDistribution.put("F", 0L);

        for (Student s : activeStudents) {
            double m = s.getMarks() != null ? s.getMarks() : 0.0;
            if (m >= 90) gradeDistribution.put("A+", gradeDistribution.get("A+") + 1);
            else if (m >= 80) gradeDistribution.put("A", gradeDistribution.get("A") + 1);
            else if (m >= 70) gradeDistribution.put("B", gradeDistribution.get("B") + 1);
            else if (m >= 50) gradeDistribution.put("C", gradeDistribution.get("C") + 1);
            else gradeDistribution.put("F", gradeDistribution.get("F") + 1);
        }

        // Recent Activities
        List<ActivityDTO> activities = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Student s : allStudents) {
            if (Boolean.TRUE.equals(s.getIsDeleted())) {
                activities.add(new ActivityDTO(
                        "Student deleted: " + s.getName() + " (Roll No: " + s.getRollNo() + ")",
                        formatTimeAgo(s.getUpdatedAt(), now),
                        "Deleted",
                        s.getUpdatedAt() != null ? s.getUpdatedAt() : now
                ));
            } else if (s.getUpdatedAt() != null && s.getCreatedAt() != null && s.getUpdatedAt().isAfter(s.getCreatedAt().plusSeconds(5))) {
                activities.add(new ActivityDTO(
                        "Student updated: " + s.getName() + " (Roll No: " + s.getRollNo() + ")",
                        formatTimeAgo(s.getUpdatedAt(), now),
                        "Updated",
                        s.getUpdatedAt()
                ));
            } else {
                activities.add(new ActivityDTO(
                        "New student added: " + s.getName() + " (Roll No: " + s.getRollNo() + ")",
                        formatTimeAgo(s.getCreatedAt(), now),
                        "Created",
                        s.getCreatedAt() != null ? s.getCreatedAt() : now
                ));
            }
        }

        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        if (activities.size() > 5) {
            activities = activities.subList(0, 5);
        }

        return new DashboardStatsDTO(
                totalStudents,
                deletedStudents,
                totalBranches,
                averageMarks,
                branchDistribution,
                gradeDistribution,
                activities
        );
    }

    private String formatTimeAgo(LocalDateTime time, LocalDateTime now) {
        if (time == null) return "Just now";
        Duration duration = Duration.between(time, now);
        long minutes = Math.abs(duration.toMinutes());
        long hours = Math.abs(duration.toHours());
        long days = Math.abs(duration.toDays());

        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " mins ago";
        if (hours < 24) return hours + " hours ago";
        if (days == 1) return "1 day ago";
        return days + " days ago";
    }
}
