package com.teamtaskmanager.task;

import com.teamtaskmanager.project.Project;
import com.teamtaskmanager.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "tasks", indexes = {
		@Index(name = "idx_tasks_project", columnList = "project_id"),
		@Index(name = "idx_tasks_assigned_to", columnList = "assigned_to"),
		@Index(name = "idx_tasks_status", columnList = "status"),
		@Index(name = "idx_tasks_due_date", columnList = "due_date")
})
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "text")
	private String description;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_to", nullable = false, foreignKey = @ForeignKey(name = "fk_tasks_assigned_to"))
	private User assignedTo;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tasks_project"))
	private Project project;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskStatus status;

	@Column(name = "due_date")
	private LocalDate dueDate;

	protected Task() {
	}

	public Task(String title, String description, User assignedTo, Project project, TaskStatus status, LocalDate dueDate) {
		this.title = title;
		this.description = description;
		this.assignedTo = assignedTo;
		this.project = project;
		this.status = status;
		this.dueDate = dueDate;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public User getAssignedTo() {
		return assignedTo;
	}

	public Project getProject() {
		return project;
	}

	public TaskStatus getStatus() {
		return status;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}

	public boolean isOverdue(LocalDate today) {
		return dueDate != null && dueDate.isBefore(today) && status != TaskStatus.COMPLETED;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Task task = (Task) o;
		return Objects.equals(id, task.id);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(id);
	}
}

