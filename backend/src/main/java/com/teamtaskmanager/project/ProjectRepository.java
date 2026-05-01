package com.teamtaskmanager.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query("""
			select p from Project p
			join p.teamMembers m
			where m.id = :userId
			order by p.id desc
			""")
	List<Project> findAllVisibleToUser(@Param("userId") Long userId);

	@Query("""
			select count(p) > 0 from Project p
			join p.teamMembers m
			where p.id = :projectId and m.id = :userId
			""")
	boolean isMember(@Param("projectId") Long projectId, @Param("userId") Long userId);
}

