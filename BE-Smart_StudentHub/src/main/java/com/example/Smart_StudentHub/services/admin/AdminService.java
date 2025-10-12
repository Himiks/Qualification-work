package com.example.Smart_StudentHub.services.admin;

import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.dto.UserDto;

import java.util.List;

public interface AdminService {

    List<UserDto> getUsers();

    TaskDTO createTask(TaskDTO taskDTO);

   List<TaskDTO> getAllTasks();

   void deleteTask(Long id);

   TaskDTO getTaskById(Long id);

   TaskDTO updateTask(Long id,TaskDTO taskDTO);

   List<TaskDTO> searchTasksByUserTitle(String title);

}

