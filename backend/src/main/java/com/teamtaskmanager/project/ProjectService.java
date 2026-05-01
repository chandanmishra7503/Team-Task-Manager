package com.teamtaskmanager.project;

import com.teamtaskmanager.common.exception.BadRequestException;
import com.teamtaskmanager.common.exception.NotFoundException;
import com.teamtaskmanager.project.dto.CreateProjectRequest;
import com.teamtaskmanager.project.dto.ProjectResponse;
import com.teamtaskmanager.task.TaskRepository; // 🔥 NEW IMPORT
import com.teamtaskmanager.user.User;
import com.teamtaskmanager.user.UserRepository;
import com.teamtaskmanager.user.dto.UserSummary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository; // 🔥 NEW

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository; // 🔥 NEW
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest req, User creator) {
        Project project = new Project(req.title().trim(), req.description(), creator);
        project.addMember(creator);

        if (req.memberIds() != null && !req.memberIds().isEmpty()) {
            List<User> members = userRepository.findAllById(req.memberIds());
            if (members.size() != req.memberIds().size()) {
                throw new BadRequestException("One or more memberIds do not exist");
            }
            for (User u : members) {
                project.addMember(u);
            }
        }

        return toResponse(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listForAdmin() {
        return projectRepository.findAll().stream()
                .sorted(Comparator.comparing(Project::getId).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listForMember(Long userId) {
        return projectRepository.findAllVisibleToUser(userId).stream()
                .map(this::toResponse)
                .toList();
    }

 
    @Transactional
    public void delete(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new NotFoundException("Project not found");
        }

        
        taskRepository.deleteByProjectId(projectId);

        
        projectRepository.deleteById(projectId);
    }

    @Transactional
    public ProjectResponse addMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        project.addMember(user);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse removeMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        project.removeMember(user);
        return toResponse(project);
    }

    @Transactional(readOnly = true)
    public Project requireProjectVisibleToMember(Long projectId, Long memberId) {
        boolean ok = projectRepository.isMember(projectId, memberId);
        if (!ok) {
            throw new NotFoundException("Project not found");
        }
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));
    }

    private ProjectResponse toResponse(Project project) {
        UserSummary createdBy = new UserSummary(
                project.getCreatedBy().getId(),
                project.getCreatedBy().getEmail(),
                project.getCreatedBy().getRole()
        );

        Set<User> members = project.getTeamMembers();

        List<UserSummary> team = members.stream()
                .map(u -> new UserSummary(u.getId(), u.getEmail(), u.getRole()))
                .sorted(Comparator.comparing(UserSummary::id))
                .collect(Collectors.toList());

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                createdBy,
                team
        );
    }
}