package com.teamtaskmanager.task;

import com.teamtaskmanager.security.CurrentUser;
import com.teamtaskmanager.task.dto.CreateTaskRequest;
import com.teamtaskmanager.task.dto.TaskResponse;
import com.teamtaskmanager.task.dto.UpdateTaskStatusRequest;
import com.teamtaskmanager.user.User;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> search(@RequestParam(required = false) TaskStatus status,
                                    @RequestParam(required = false) Long projectId) {
        User me = CurrentUser.require();
        return taskService.search(me, status, projectId);
    }

    @GetMapping("/overdue")
    public List<TaskResponse> overdue() {
        return taskService.overdue(CurrentUser.require());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest req) {
        return taskService.create(req);
    }

    @PatchMapping("/{taskId}/status")
    public TaskResponse updateStatus(@PathVariable Long taskId,
                                    @Valid @RequestBody UpdateTaskStatusRequest req) {
        return taskService.updateStatus(CurrentUser.require(), taskId, req.status());
    }

  
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}