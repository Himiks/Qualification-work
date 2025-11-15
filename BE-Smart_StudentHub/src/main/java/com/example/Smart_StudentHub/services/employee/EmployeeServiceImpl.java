package com.example.Smart_StudentHub.services.employee;

import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.entities.Comment;
import com.example.Smart_StudentHub.entities.Task;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import com.example.Smart_StudentHub.enums.UserRole;
import com.example.Smart_StudentHub.repositories.CommentRepository;
import com.example.Smart_StudentHub.repositories.TaskRepository;
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
public class EmployeeServiceImpl implements EmployeeService {
    private final TaskRepository taskRepository;

    private final JwtUtils jwtUtils;

    private final CommentRepository commentRepository;



    @Override
    public List<TaskDTO> getTaskByUserId() {
        User user = jwtUtils.getLoggedInUser();
        if(user != null){
            return taskRepository.findAllByUserId(user.getId())
                    .stream()
                    .sorted(Comparator.comparing(Task::getDueDate).reversed())
                    .map(Task::getTaskDTO)
                    .collect(Collectors.toList());
        }
        throw new EntityNotFoundException("User not found");
    }




    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        User user = jwtUtils.getLoggedInUser();

        if(user != null){
            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setDueDate(taskDTO.getDueDate());
            task.setTaskStatus(TaskStatus.IN_PROGRESS);
            task.setUser(user);
            task.setTechnique(TaskTechnique.valueOf(String.valueOf(taskDTO.getTechnique())));
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
    public List<TaskDTO> getTasksByTechnique(TaskTechnique technique) {

        User user = jwtUtils.getLoggedInUser();
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }


        return taskRepository.findAllByUserIdAndTechnique(user.getId(), technique)
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
    }


    @Override
    public TaskDTO getTaskById(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        return optionalTask.map(Task::getTaskDTO).orElse(null);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Optional<Task> optionalTask = taskRepository.findById(id);
            Task task = optionalTask.get();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setPriority(taskDTO.getPriority());
            task.setDueDate(taskDTO.getDueDate());
            task.setTaskStatus(mapStringToTaskStatus(String.valueOf(taskDTO.getTaskStatus())));
            task.setTechnique(TaskTechnique.valueOf(String.valueOf(taskDTO.getTechnique())));
        return taskRepository.save(task).getTaskDTO();


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
    public List<TaskDTO> searchTasksByUserTitle(String title) {
        User user = jwtUtils.getLoggedInUser();

        if(user == null){
            throw new EntityNotFoundException("User not found");
        }
        boolean isAdmin = user.getUserRole() == UserRole.ADMIN;
        List<Task> tasks;

        if(isAdmin){
            tasks = taskRepository.findAllByTitleContaining(title);
        }else{
            tasks = taskRepository.findAllByUserIdAndTitleContaining(user.getId(), title);
        }

        return tasks.stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
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
