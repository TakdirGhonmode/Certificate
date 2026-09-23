package in.ProjectS.StudentManagementSystem.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalStudents;
    private long deletedStudents;
    private long totalBranches;
    private double averageMarks;
    private Map<String, Long> branchDistribution;
    private Map<String, Long> gradeDistribution;
    private List<ActivityDTO> recentActivities;
}
