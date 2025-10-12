package com.example.Smart_StudentHub.services.employee;

import com.example.Smart_StudentHub.dto.TaskDTO;

import java.util.List;

public interface EmployeeService {
  List<TaskDTO> getTaskByUserId();
  TaskDTO updateTask(Long id, String status);
}
