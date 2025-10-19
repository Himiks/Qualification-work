package com.example.Smart_StudentHub.services.admin;


import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
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
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements  AdminService {
    private final UserRepository userRepository;

    private final TaskRepository taskRepository;


    private final JwtUtils jwtUtils;


    private final CommentRepository commentRepository;


    @Override
    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
            Optional<User> optionalUser = userRepository.findById(taskDTO.getEmployeeId());

        if(optionalUser.isPresent()){
            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setDueDate(taskDTO.getDueDate());
            task.setTaskStatus(TaskStatus.IN_PROGRESS);
            task.setUser(optionalUser.get());
            return taskRepository.save(task).getTaskDTO();

        }

        return null;
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public TaskDTO getTaskById(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        return optionalTask.map(Task::getTaskDTO).orElse(null);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
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
            return taskRepository.save(task).getTaskDTO();

        }
        return null;
    }

    @Override
    public List<TaskDTO> searchTasksByUserTitle(String title) {
        return taskRepository.findAllByTitleContaining(title)
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());

    }



    @Override
    public CommentDTO createComment(Long taskId, String content) {
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
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        return commentRepository.findAllByTaskId(taskId).stream().map(Comment::getCommentDTO).collect(Collectors.toList());
    }


    private TaskStatus mapStringToTaskStatus(String status) {
        return switch (status) {
            case "PENDING" -> TaskStatus.PENDING;
            case "IN_PROGRESS" -> TaskStatus.IN_PROGRESS;
            case "COMPLETED" -> TaskStatus.COMPLETED;
            case "DEFERRED" -> TaskStatus.DEFERRED;
            default -> TaskStatus.CANCELLED;
        };
    }
}
