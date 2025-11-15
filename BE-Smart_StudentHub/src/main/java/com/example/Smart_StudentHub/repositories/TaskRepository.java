package com.example.Smart_StudentHub.repositories;


import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.entities.Task;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findAllByTitleContaining(String title);

    List<Task> findAllByUserId(Long id);

    List<Task> findAllByUserIdAndTechnique(Long userId, TaskTechnique technique);

    List<Task> findAllByUserIdAndTitleContaining(Long userId, String title);
}
