package com.example.Smart_StudentHub.repositories;


import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findAllByTitleContaining(String title);

    List<Task> findAllByUserId(Long id);
}
