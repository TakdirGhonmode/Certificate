package in.ProjectS.StudentManagementSystem.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequestDTO {
    @NotNull(message = "Roll number is required")
    @Positive(message = "Roll number must be positive")
    private Integer rollNo;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Age is required")
    @Min(value = 16, message = "Age must be at least 16")
    @Max(value = 60, message = "Age must be at most 60")
    private Integer age;

    @NotNull(message = "Marks are required")
    @DecimalMin(value = "0.0", message = "Marks cannot be less than 0")
    @DecimalMax(value = "100.0", message = "Marks cannot be greater than 100")
    private Double marks;
}
