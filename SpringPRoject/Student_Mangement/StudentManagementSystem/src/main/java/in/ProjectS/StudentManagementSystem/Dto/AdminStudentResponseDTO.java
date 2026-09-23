package in.ProjectS.StudentManagementSystem.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminStudentResponseDTO {

    private Long id;
    private Integer rollNo;
    private String name;
    private String email;
    private String branch;
    private Integer age;
    private Double marks;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
