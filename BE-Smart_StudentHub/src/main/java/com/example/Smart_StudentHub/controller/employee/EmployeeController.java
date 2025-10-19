package com.example.Smart_StudentHub.controller.employee;

import com.example.Smart_StudentHub.dto.CommentDTO;
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



    @PostMapping("/task")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTaskDTO =  employeeService.createTask(taskDTO);

        if(createdTaskDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTaskDTO);

    }


    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByUserId(){
       return ResponseEntity.ok(employeeService.getTaskByUserId());
    }


    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        employeeService.deleteTask(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/task/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTaskDTO = employeeService.updateTask(id, taskDTO);
        if(updatedTaskDTO == null)return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedTaskDTO);
    }


    @GetMapping("/tasks/search/{title}")
    public ResponseEntity<List<TaskDTO>> searchTask(@PathVariable String title) {
        return ResponseEntity.ok(employeeService.searchTasksByUserTitle(title));
    }

    @PostMapping("/task/comment/{taskId}")
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long taskId, @RequestParam String content) {
        CommentDTO createdCommentDTO =  employeeService.createComment(taskId, content);

        if(createdCommentDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommentDTO);

    }

    @GetMapping("/comments/{taskId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(employeeService.getCommentsByTaskId(taskId));
    }


    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDTO> getTaskById( @PathVariable  Long id) {
        return ResponseEntity.ok(employeeService.getTaskById(id));
    }
}
