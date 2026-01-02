package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.dto.UpdateUserDTO;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.entities.Comment;
import com.example.Smart_StudentHub.entities.Task;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import com.example.Smart_StudentHub.enums.UserRole;
import com.example.Smart_StudentHub.repositories.CommentRepository;
import com.example.Smart_StudentHub.repositories.TaskRepository;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.services.employee.EmployeeServiceImpl;
import com.example.Smart_StudentHub.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmployeeServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private User employee;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        employee = new User();
        employee.setId(1L);
        employee.setName("Test User");
        employee.setUserRole(UserRole.EMPLOYEE);
    }

    @Test
    void getTaskByUserId_success() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(employee);

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(taskRepository.findAllByUserId(1L)).thenReturn(Collections.singletonList(task));

        List<TaskDTO> result = employeeService.getTaskByUserId();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void createTask_success() {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("Task");
        dto.setTechnique(TaskTechnique.EISENHOWER);

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> {
            Task t = i.getArgument(0);
            t.setId(1L);
            return t;
        });

        TaskDTO result = employeeService.createTask(dto);

        assertNotNull(result);
        assertEquals("Task", result.getTitle());
    }

    @Test
    void updateMyProfile_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setName("Updated");

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(userRepository.save(employee)).thenReturn(employee);

        UserDto result = employeeService.updateMyProfile(dto);

        assertNotNull(result);
        assertEquals("Updated", result.getName());
    }

    @Test
    void getTaskById_found() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(employee);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskDTO result = employeeService.getTaskById(1L);

        assertNotNull(result);
    }

    @Test
    void updateTask_success() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(employee);

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Updated");
        dto.setTaskStatus(TaskStatus.IN_PROGRESS);
        dto.setTechnique(TaskTechnique.DEEP_WORK);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        TaskDTO result = employeeService.updateTask(1L, dto);

        assertNotNull(result);
        assertEquals("Updated", result.getTitle());
    }

    @Test
    void createComment_success() {
        Task task = new Task();
        task.setId(1L);

        Comment comment = new Comment();
        comment.setId(10L);
        comment.setUser(employee);
        comment.setTask(task);
        comment.setContent("text");
        comment.setCreatedAt(new Date());

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDTO result = employeeService.createComment(1L, "text");

        assertNotNull(result);
        assertEquals("text", result.getContent());
    }

    @Test
    void updateComment_asOwner() {
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setUser(employee);
        comment.setContent("old");
        comment.setTask(new Task());
        comment.setCreatedAt(new Date());

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(comment)).thenReturn(comment);

        CommentDTO result = employeeService.updateComment(1L, "new");

        assertNotNull(result);
        assertEquals("new", result.getContent());
    }

    @Test
    void deleteComment_asOwner() {
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setUser(employee);
        comment.setTask(new Task());
        comment.setCreatedAt(new Date());

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        employeeService.deleteComment(1L);

        verify(commentRepository, times(1)).delete(comment);
    }

    @Test
    void getCommentsByTaskId_success() {
        Task task = new Task();
        task.setId(1L);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setUser(employee);
        comment.setTask(task);
        comment.setContent("text");
        comment.setCreatedAt(new Date());

        when(commentRepository.findAllByTaskId(1L)).thenReturn(Collections.singletonList(comment));

        var result = employeeService.getCommentsByTaskId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("text", result.get(0).getContent());
    }
}
