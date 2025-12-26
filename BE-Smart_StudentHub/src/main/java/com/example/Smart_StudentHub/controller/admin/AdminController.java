package com.example.Smart_StudentHub.controller.admin;


import com.example.Smart_StudentHub.dto.*;
import com.example.Smart_StudentHub.services.admin.AdminService;
import com.example.Smart_StudentHub.services.technique.TechniqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private  final TechniqueService techniqueService;




    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateMyProfile(@RequestBody UpdateUserDTO dto) {
        return ResponseEntity.ok(adminService.updateMyProfile(dto));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto) {
        return ResponseEntity.ok(adminService.updateUserById(id, dto));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }


    @PostMapping("/task")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTaskDTO =  adminService.createTask(taskDTO);

        if(createdTaskDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTaskDTO);

    }


    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }


    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        adminService.deleteTask(id);
        return ResponseEntity.ok(null);
    }

    @DeleteMapping("/user/{id}")
        public ResponseEntity<Void> deleteUser(@PathVariable Long id){
            adminService.deleteUserById(id);
            return ResponseEntity.ok(null);
        }


    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDTO> getTaskById( @PathVariable  Long id) {
        return ResponseEntity.ok(adminService.getTaskById(id));
    }


    @PutMapping("/task/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTaskDTO = adminService.updateTask(id, taskDTO);
        if(updatedTaskDTO == null)return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedTaskDTO);
    }


    @GetMapping("/tasks/search/{title}")
    public ResponseEntity<List<TaskDTO>> searchTask(@PathVariable String title) {
        return ResponseEntity.ok(adminService.searchTasksByUserTitle(title));
    }


    @PostMapping("/task/comment/{taskId}")
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long taskId, @RequestParam String content) {
        CommentDTO createdCommentDTO =  adminService.createComment(taskId, content);

        if(createdCommentDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommentDTO);

    }


    @GetMapping("/comments/{taskId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(adminService.getCommentsByTaskId(taskId));
    }


    @PostMapping("techniques")
    public ResponseEntity<TechniqueDTO> createTechnique(@RequestBody TechniqueDTO techniqueDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(techniqueService.createTechnique(techniqueDTO));
    }
    @PutMapping("techniques/{id}")
    public ResponseEntity<TechniqueDTO> updateTechnique(@PathVariable Long id, @RequestBody TechniqueDTO techniqueDTO) {
        return ResponseEntity.ok(techniqueService.updateTechnique(id, techniqueDTO));
    }

    @DeleteMapping("techniques/{id}")
    public ResponseEntity<Void> deleteTechnique(@PathVariable Long id) {
        techniqueService.deleteTechnique(id);
        return ResponseEntity.noContent().build();
    }



}
