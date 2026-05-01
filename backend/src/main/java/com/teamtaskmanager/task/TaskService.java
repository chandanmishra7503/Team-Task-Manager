package com.teamtaskmanager.task;

import com.teamtaskmanager.common.exception.BadRequestException;
import com.teamtaskmanager.common.exception.NotFoundException;
import com.teamtaskmanager.project.Project;
import com.teamtaskmanager.project.ProjectRepository;
import com.teamtaskmanager.task.dto.CreateTaskRequest;
import com.teamtaskmanager.task.dto.TaskResponse;
import com.teamtaskmanager.user.Role;
import com.teamtaskmanager.user.User;
import com.teamtaskmanager.user.UserRepository;
import com.teamtaskmanager.user.dto.UserSummary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest req) {
        Project project = projectRepository.findById(req.projectId())
                .orElseThrow(() -> new NotFoundException("Project not found"));

        User assignedTo = userRepository.findById(req.assignedToUserId())
                .orElseThrow(() -> new NotFoundException("Assigned user not found"));

        boolean isMember = projectRepository.isMember(project.getId(), assignedTo.getId());
        if (!isMember) {
            throw new BadRequestException("assignedToUserId must be a project member");
        }

        Task task = new Task(
                req.title().trim(),
                req.description(),
                assignedTo,
                project,
                TaskStatus.PENDING,
                req.dueDate()
        );

        return toResponse(taskRepository.save(task), LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> search(User me, TaskStatus status, Long projectId) {
        LocalDate today = LocalDate.now();

        if (me.getRole() == Role.ADMIN) {
            return taskRepository.searchForAdmin(status, projectId)
                    .stream()
                    .map(t -> toResponse(t, today))
                    .toList();
        }

        return taskRepository.searchForMember(me.getId(), status, projectId)
                .stream()
                .map(t -> toResponse(t, today))
                .toList();
    }

    @Transactional
    public TaskResponse updateStatus(User me, Long taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (me.getRole() == Role.MEMBER &&
                !task.getAssignedTo().getId().equals(me.getId())) {
            throw new NotFoundException("Task not found");
        }

        task.setStatus(newStatus);
        return toResponse(task, LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> overdue(User me) {
        LocalDate today = LocalDate.now();

        if (me.getRole() == Role.ADMIN) {
            return taskRepository.findOverdueForAdmin(today)
                    .stream()
                    .map(t -> toResponse(t, today))
                    .toList();
        }

        return taskRepository.findOverdueForMember(me.getId(), today)
                .stream()
                .map(t -> toResponse(t, today))
                .toList();
    }

    
    @Transactional
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task t, LocalDate today) {
        User assigned = t.getAssignedTo();
        UserSummary assignedTo = new UserSummary(
                assigned.getId(),
                assigned.getEmail(),
                assigned.getRole()
        );

        boolean overdue = t.isOverdue(today);

        return new TaskResponse(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getProject().getId(),
                t.getProject().getTitle(),
                assignedTo,
                t.getStatus(),
                t.getDueDate(),
                overdue
        );
    }
}