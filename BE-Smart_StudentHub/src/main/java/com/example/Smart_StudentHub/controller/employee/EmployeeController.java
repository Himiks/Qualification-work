package com.example.Smart_StudentHub.controller.employee;

import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.services.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;


    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByUserId(Long userId){
       return ResponseEntity.ok(employeeService.getTaskByUserId());
    }

    @PutMapping("/task/{id}/{status}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @PathVariable String status){
        TaskDTO updatedTaskDTO = employeeService.updateTask(id, status);

        if(updatedTaskDTO == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        return ResponseEntity.ok(updatedTaskDTO);

    }
}
