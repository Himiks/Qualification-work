package com.example.Smart_StudentHub.service;

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
import com.example.Smart_StudentHub.services.admin.AdminServiceImpl;
import com.example.Smart_StudentHub.utils.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AdminServiceImpl adminService;

    private User admin;
    private User employee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        admin = new User();
        admin.setId(1L);
        admin.setUserRole(UserRole.ADMIN);

        employee = new User();
        employee.setId(2L);
        employee.setUserRole(UserRole.EMPLOYEE);
    }

    @Test
    void getUsers_success() {
        when(userRepository.findAll()).thenReturn(List.of(admin, employee));

        List<UserDto> result = adminService.getUsers();

        assertEquals(2, result.size());
    }

    @Test
    void updateMyProfile_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setName("New Name");
        dto.setPassword("pass");

        when(jwtUtils.getLoggedInUser()).thenReturn(admin);
        when(passwordEncoder.encode("pass")).thenReturn("encoded");

        UserDto result = adminService.updateMyProfile(dto);

        assertEquals("New Name", result.getName());
        verify(userRepository).save(admin);
    }

    @Test
    void updateMyProfile_notAdmin() {
        when(jwtUtils.getLoggedInUser()).thenReturn(employee);

        assertThrows(EntityNotFoundException.class,
                () -> adminService.updateMyProfile(new UpdateUserDTO()));
    }

    @Test
    void createTask_success() {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("Task");

        when(jwtUtils.getLoggedInUser()).thenReturn(admin);
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArgument(0));

        TaskDTO result = adminService.createTask(dto);

        assertEquals("Task", result.getTitle());
    }

    @Test
    void getTaskById_found() {
        User user = new User();
        user.setId(5L);
        user.setName("John");

        Task task = new Task();
        task.setId(1L);
        task.setUser(user);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskDTO result = adminService.getTaskById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John", result.getEmployeeName());
    }

    @Test
    void updateTask_success() {
        Task task = new Task();
        User user = new User();
        user.setId(2L);

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Updated");
        dto.setEmployeeId(2L);
        dto.setTaskStatus(TaskStatus.COMPLETED);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDTO result = adminService.updateTask(1L, dto);

        assertEquals("Updated", result.getTitle());
    }

    @Test
    void createComment_success() {
        User user = new User();
        user.setId(2L);
        user.setName("Employee");

        Task task = new Task();
        task.setId(1L);

        Comment comment = new Comment();
        comment.setId(10L);
        comment.setUser(user);
        comment.setTask(task);
        comment.setCreatedAt(new Date());
        comment.setContent("text");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(jwtUtils.getLoggedInUser()).thenReturn(user);
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDTO result = adminService.createComment(1L, "text");

        assertNotNull(result);
        assertEquals("text", result.getContent());
    }


    @Test
    void updateComment_asOwner() {
        Task task = new Task();
        task.setId(10L);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setUser(employee);
        comment.setTask(task);

        when(jwtUtils.getLoggedInUser()).thenReturn(employee);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDTO result = adminService.updateComment(1L, "new");

        assertNotNull(result);
        assertEquals("new", result.getContent());
        assertEquals(10L, result.getTaskId());
    }


    @Test
    void deleteComment_notAllowed() {
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setUser(employee);

        when(jwtUtils.getLoggedInUser()).thenReturn(admin);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        assertDoesNotThrow(() -> adminService.deleteComment(1L));
    }
}
