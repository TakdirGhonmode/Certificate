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
public class ActivityDTO {
    private String title;
    private String timeAgo;
    private String type; // "Created", "Updated", "Deleted"
    private LocalDateTime timestamp;
}
