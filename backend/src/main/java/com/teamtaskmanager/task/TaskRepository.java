package com.teamtaskmanager.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
            select t from Task t
            where t.assignedTo.id = :userId
            order by t.id desc
            """)
    List<Task> findAllAssignedTo(@Param("userId") Long userId);

    @Query("""
            select t from Task t
            where t.project.id = :projectId
            order by t.id desc
            """)
    List<Task> findAllByProjectId(@Param("projectId") Long projectId);

    
    void deleteByProjectId(Long projectId);

    @Query("""
            select t from Task t
            where t.assignedTo.id = :userId
              and (:status is null or t.status = :status)
              and (:projectId is null or t.project.id = :projectId)
            order by t.id desc
            """)
    List<Task> searchForMember(
            @Param("userId") Long userId,
            @Param("status") TaskStatus status,
            @Param("projectId") Long projectId
    );

    @Query("""
            select t from Task t
            where (:status is null or t.status = :status)
              and (:projectId is null or t.project.id = :projectId)
            order by t.id desc
            """)
    List<Task> searchForAdmin(
            @Param("status") TaskStatus status,
            @Param("projectId") Long projectId
    );

    @Query("""
            select t from Task t
            where t.assignedTo.id = :userId
              and t.dueDate is not null
              and t.dueDate < :today
              and t.status <> 'COMPLETED'
            order by t.dueDate asc
            """)
    List<Task> findOverdueForMember(
            @Param("userId") Long userId,
            @Param("today") LocalDate today
    );

    @Query("""
            select t from Task t
            where t.dueDate is not null
              and t.dueDate < :today
              and t.status <> 'COMPLETED'
            order by t.dueDate asc
            """)
    List<Task> findOverdueForAdmin(@Param("today") LocalDate today);
}