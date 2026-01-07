package com.example.Smart_StudentHub.services.admin;


import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.dto.UpdateUserDTO;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.entities.Comment;
import com.example.Smart_StudentHub.entities.Task;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.UserRole;
import com.example.Smart_StudentHub.repositories.CommentRepository;
import com.example.Smart_StudentHub.repositories.TaskRepository;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.utils.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements  AdminService {
    private final UserRepository userRepository; // user repository database layer

    private final TaskRepository taskRepository; // task repository database layer

    private final PasswordEncoder passwordEncoder; // password encoder


    private final JwtUtils jwtUtils; // token utilities to handle security


    private final CommentRepository commentRepository;


    @Override
    public List<UserDto> getUsers() {     // Returns all users with role EMPLOYEE or ADMIN as DTOs
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE || user.getUserRole() == UserRole.ADMIN)
                .map(User::getUserDto)
                .collect(Collectors.toList());
    }


    @Override
    public UserDto updateMyProfile(UpdateUserDTO dto) {     // Updates the currently logged-in admin’s own profile with provided fields
        User admin = jwtUtils.getLoggedInUser();

        if (admin == null || admin.getUserRole() != UserRole.ADMIN) {
            throw new EntityNotFoundException("Access denied");
        }

        updateFields(admin, dto);
        userRepository.save(admin);
        return admin.getUserDto();
    }

    @Override
    public UserDto updateUserById(Long id, UpdateUserDTO dto) {     // Updates another user’s details by ID, only if the logged-in user is an admin
        User admin = jwtUtils.getLoggedInUser();
        if (admin.getUserRole() != UserRole.ADMIN) {
            throw new EntityNotFoundException("Only admin can update users");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        updateFields(user, dto);
        userRepository.save(user);

        return user.getUserDto();
    }

    @Override
    public UserDto getUserById(Long id) {     // Fetches a user by ID and returns it as a DTO
        return userRepository.findById(id)
                .map(User::getUserDto)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }




    private void updateFields(User user, UpdateUserDTO dto) {     // Helper method to update user fields (name, email, password)

        if (dto.getName() != null)
            user.setName(dto.getName());

        if (dto.getEmail() != null)
            user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {     // Creates a new task assigned to the currently logged-in admin
        User admin = jwtUtils.getLoggedInUser();

            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setDueDate(taskDTO.getDueDate());
            task.setTaskStatus(TaskStatus.IN_PROGRESS);
            task.setTechnique(taskDTO.getTechnique());
            task.setUser(admin);
            return taskRepository.save(task).getTaskDTO();


    }

    @Override
    public List<TaskDTO> getAllTasks() {     // Retrieves all tasks, sorts them by due date descending, and maps to DTOs
        return taskRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }     // Deletes a task by ID

    @Override
    public void deleteUserById(Long id) {     // Deletes a user by ID
        userRepository.deleteById(id);
    }

    @Override
    public TaskDTO getTaskById(Long id) {     // Retrieves a task by ID and returns as DTO; returns null if not found
        Optional<Task> optionalTask = taskRepository.findById(id);
        return optionalTask.map(Task::getTaskDTO).orElse(null);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {     // Updates an existing task’s details and assigned employee
        Optional<Task> optionalTask = taskRepository.findById(id);
        Optional<User> optionalUser = userRepository.findById(taskDTO.getEmployeeId());
        if(optionalTask.isPresent() && optionalUser.isPresent()){
            Task task = optionalTask.get();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setDueDate(taskDTO.getDueDate());
            task.setTaskStatus(mapStringToTaskStatus(String.valueOf(taskDTO.getTaskStatus())));
            task.setUser(optionalUser.get());
            task.setTechnique(taskDTO.getTechnique());
            return taskRepository.save(task).getTaskDTO();

        }
        return null;
    }

    @Override
    public CommentDTO updateComment(Long commentId, String content) {     // Updates a comment’s content if the logged-in user is the author or an admin
        User user = jwtUtils.getLoggedInUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())
                && user.getUserRole() != UserRole.ADMIN) {
            throw new EntityNotFoundException("Access denied");
        }

        comment.setContent(content);
        return commentRepository.save(comment).getCommentDTO();
    }

    @Override
    public void deleteComment(Long commentId) {     // Deletes a comment if the logged-in user is the author or an admin
        User user = jwtUtils.getLoggedInUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())
                && user.getUserRole() != UserRole.ADMIN) {
            throw new EntityNotFoundException("Access denied");
        }

        commentRepository.delete(comment);
    }


    @Override
    public List<TaskDTO> searchTasksByUserTitle(String title) {     // Searches tasks by title substring, sorts by due date descending, returns DTOs
        return taskRepository.findAllByTitleContaining(title)
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());

    }



    @Override
    public CommentDTO createComment(Long taskId, String content) {     // Creates a new comment on a task for the currently logged-in user
      Optional<Task> optionalTask = taskRepository.findById(taskId);
      User user = jwtUtils.getLoggedInUser();
      if(optionalTask.isPresent() && user != null ){
          Comment comment = new Comment();
          comment.setCreatedAt(new Date());
          comment.setContent(content);
          comment.setTask(optionalTask.get());
          comment.setUser(user);
          return commentRepository.save(comment).getCommentDTO();

      }
      throw new EntityNotFoundException("Task not found");
    }

    @Override
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {     // Retrieves all comments for a given task ID and returns as DTOs
        return commentRepository.findAllByTaskId(taskId).stream().map(Comment::getCommentDTO).collect(Collectors.toList());
    }


    private TaskStatus mapStringToTaskStatus(String status) {     // Maps a string to a TaskStatus enum value
        return switch (status) {
            case "PENDING" -> TaskStatus.PENDING;
            case "IN_PROGRESS" -> TaskStatus.IN_PROGRESS;
            case "COMPLETED" -> TaskStatus.COMPLETED;
            case "DEFERRED" -> TaskStatus.DEFERRED;
            default -> TaskStatus.CANCELLED;
        };
    }
}
