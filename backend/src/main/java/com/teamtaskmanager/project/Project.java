package com.teamtaskmanager.project;

import com.teamtaskmanager.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "text")
	private String description;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_projects_created_by"))
	private User createdBy;

	@ManyToMany
	@JoinTable(
			name = "project_members",
			joinColumns = @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "fk_project_members_project")),
			inverseJoinColumns = @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_project_members_user")),
			uniqueConstraints = @UniqueConstraint(name = "uk_project_members_project_user", columnNames = {"project_id", "user_id"})
	)
	private Set<User> teamMembers = new HashSet<>();

	protected Project() {
	}

	public Project(String title, String description, User createdBy) {
		this.title = title;
		this.description = description;
		this.createdBy = createdBy;
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

	public User getCreatedBy() {
		return createdBy;
	}

	public Set<User> getTeamMembers() {
		return teamMembers;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void addMember(User user) {
		teamMembers.add(user);
	}

	public void removeMember(User user) {
		teamMembers.remove(user);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Project project = (Project) o;
		return Objects.equals(id, project.id);
	}

	@Override
	public int hashCode() {
		return Objects.hashCode(id);
	}
}

