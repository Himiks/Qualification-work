package com.example.Smart_StudentHub.services.employee;

import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.enums.TaskTechnique;

import java.util.List;

public interface EmployeeService {

  List<TaskDTO> getTaskByUserId();


  TaskDTO updateTask(Long id,TaskDTO taskDTO);


  CommentDTO createComment(Long taskId, String comment);

  List<CommentDTO> getCommentsByTaskId(Long taskId);

  TaskDTO getTaskById(Long id);

  List<TaskDTO> searchTasksByUserTitle(String title);

  TaskDTO createTask(TaskDTO taskDTO);

  List<TaskDTO> getAllTasks();

  void deleteTask(Long id);

  List<TaskDTO> getTasksByTechnique(TaskTechnique technique);

}
