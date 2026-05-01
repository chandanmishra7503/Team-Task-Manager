package com.teamtaskmanager.project;

import com.teamtaskmanager.project.dto.CreateProjectRequest;
import com.teamtaskmanager.project.dto.ProjectResponse;
import com.teamtaskmanager.project.dto.UpdateProjectMemberRequest;
import com.teamtaskmanager.security.CurrentUser;
import com.teamtaskmanager.user.Role;
import com.teamtaskmanager.user.User;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping
	public List<ProjectResponse> list() {
		User me = CurrentUser.require();
		if (me.getRole() == Role.ADMIN) {
			return projectService.listForAdmin();
		}
		return projectService.listForMember(me.getId());
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ProjectResponse create(@Valid @RequestBody CreateProjectRequest req) {
		return projectService.create(req, CurrentUser.require());
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{projectId}")
	public void delete(@PathVariable Long projectId) {
		projectService.delete(projectId);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/{projectId}/members")
	public ProjectResponse addMember(@PathVariable Long projectId, @Valid @RequestBody UpdateProjectMemberRequest req) {
		return projectService.addMember(projectId, req.userId());
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{projectId}/members/{userId}")
	public ProjectResponse removeMember(@PathVariable Long projectId, @PathVariable Long userId) {
		return projectService.removeMember(projectId, userId);
	}
}

