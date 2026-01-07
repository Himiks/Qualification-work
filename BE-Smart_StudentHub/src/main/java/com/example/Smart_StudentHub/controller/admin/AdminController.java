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
@RequestMapping("/api/admin") // admin api's
public class AdminController {
    private final AdminService adminService; // admin service layer
    private  final TechniqueService techniqueService; // technique service later




    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    } // get all users

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateMyProfile(@RequestBody UpdateUserDTO dto) { // updates admins profile
        return ResponseEntity.ok(adminService.updateMyProfile(dto));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto) { // updates user profile
        return ResponseEntity.ok(adminService.updateUserById(id, dto));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) { // gets user by id
        return ResponseEntity.ok(adminService.getUserById(id));
    }


    @PostMapping("/task")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) { // creates task
        TaskDTO createdTaskDTO =  adminService.createTask(taskDTO);

        if(createdTaskDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTaskDTO);

    }

    @PutMapping("/comment/{id}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @RequestParam String content) { // updates comment in the specific task
        return ResponseEntity.ok(adminService.updateComment(id, content));
    }

    @DeleteMapping("/comment/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) { // deletes comment
        adminService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    } // gets all tasks


    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) { // deletes task
        adminService.deleteTask(id);
        return ResponseEntity.ok(null);
    }

    @DeleteMapping("/user/{id}")
        public ResponseEntity<Void> deleteUser(@PathVariable Long id){ // deletes user
            adminService.deleteUserById(id);
            return ResponseEntity.ok(null);
        }


    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDTO> getTaskById( @PathVariable  Long id) { // gets a task by id
        return ResponseEntity.ok(adminService.getTaskById(id));
    }


    @PutMapping("/task/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) { // updates a task
        TaskDTO updatedTaskDTO = adminService.updateTask(id, taskDTO);
        if(updatedTaskDTO == null)return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedTaskDTO);
    }


    @GetMapping("/tasks/search/{title}")
    public ResponseEntity<List<TaskDTO>> searchTask(@PathVariable String title) { // searches task
        return ResponseEntity.ok(adminService.searchTasksByUserTitle(title));
    }


    @PostMapping("/task/comment/{taskId}")
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long taskId, @RequestParam String content) { // creates comment
        CommentDTO createdCommentDTO =  adminService.createComment(taskId, content);

        if(createdCommentDTO == null)return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommentDTO);

    }


    @GetMapping("/comments/{taskId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(@PathVariable Long taskId) { // gets comment by id
        return ResponseEntity.ok(adminService.getCommentsByTaskId(taskId));
    }


    @PostMapping("techniques")
    public ResponseEntity<TechniqueDTO> createTechnique(@RequestBody TechniqueDTO techniqueDTO) { // creates technique
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(techniqueService.createTechnique(techniqueDTO));
    }
    @PutMapping("techniques/{id}")
    public ResponseEntity<TechniqueDTO> updateTechnique(@PathVariable Long id, @RequestBody TechniqueDTO techniqueDTO) { // updates technique
        return ResponseEntity.ok(techniqueService.updateTechnique(id, techniqueDTO));
    }

    @DeleteMapping("techniques/{id}")
    public ResponseEntity<Void> deleteTechnique(@PathVariable Long id) { // deletes technique
        techniqueService.deleteTechnique(id);
        return ResponseEntity.noContent().build();
    }



}
