package com.example.Smart_StudentHub.services.admin;

import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.dto.UpdateUserDTO;
import com.example.Smart_StudentHub.dto.UserDto;

import java.util.List;

public interface AdminService {

    List<UserDto> getUsers();

    UserDto updateMyProfile(UpdateUserDTO dto);

    UserDto updateUserById(Long id, UpdateUserDTO dto);

    UserDto getUserById(Long id);


    TaskDTO createTask(TaskDTO taskDTO);

   List<TaskDTO> getAllTasks();

   void deleteTask(Long id);

   void deleteUserById(Long id);

   TaskDTO getTaskById(Long id);

   TaskDTO updateTask(Long id,TaskDTO taskDTO);

   List<TaskDTO> searchTasksByUserTitle(String title);

   CommentDTO createComment(Long taskId, String comment);

   List<CommentDTO> getCommentsByTaskId(Long taskId);

}

