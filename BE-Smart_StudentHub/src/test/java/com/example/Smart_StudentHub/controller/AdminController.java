package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.admin.AdminController;
import com.example.Smart_StudentHub.dto.*;
import com.example.Smart_StudentHub.services.admin.AdminService;
import com.example.Smart_StudentHub.services.technique.TechniqueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @Mock
    private TechniqueService techniqueService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUsers_success() {
        UserDto userDto = new UserDto();
        when(adminService.getUsers()).thenReturn(List.of(userDto));

        ResponseEntity<?> response = adminController.getUsers();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, ((List<?>) response.getBody()).size());
    }

    @Test
    void updateMyProfile_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        UserDto userDto = new UserDto();
        when(adminService.updateMyProfile(dto)).thenReturn(userDto);

        ResponseEntity<UserDto> response = adminController.updateMyProfile(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void updateUser_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        UserDto userDto = new UserDto();
        when(adminService.updateUserById(1L, dto)).thenReturn(userDto);

        ResponseEntity<UserDto> response = adminController.updateUser(1L, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void getUserById_success() {
        UserDto userDto = new UserDto();
        when(adminService.getUserById(1L)).thenReturn(userDto);

        ResponseEntity<UserDto> response = adminController.getUserById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void createTask_success() {
        TaskDTO taskDTO = new TaskDTO();
        TaskDTO createdTaskDTO = new TaskDTO();
        when(adminService.createTask(taskDTO)).thenReturn(createdTaskDTO);

        ResponseEntity<TaskDTO> response = adminController.createTask(taskDTO);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(createdTaskDTO, response.getBody());
    }

    @Test
    void createTask_badRequest() {
        TaskDTO taskDTO = new TaskDTO();
        when(adminService.createTask(taskDTO)).thenReturn(null);

        ResponseEntity<TaskDTO> response = adminController.createTask(taskDTO);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void updateComment_success() {
        CommentDTO commentDTO = new CommentDTO();
        when(adminService.updateComment(1L, "content")).thenReturn(commentDTO);

        ResponseEntity<CommentDTO> response = adminController.updateComment(1L, "content");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(commentDTO, response.getBody());
    }

    @Test
    void deleteComment_success() {
        doNothing().when(adminService).deleteComment(1L);

        ResponseEntity<Void> response = adminController.deleteComment(1L);

        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void getAllTasks_success() {
        TaskDTO taskDTO = new TaskDTO();
        when(adminService.getAllTasks()).thenReturn(List.of(taskDTO));

        ResponseEntity<?> response = adminController.getAllTasks();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, ((List<?>) response.getBody()).size());
    }

    @Test
    void deleteTask_success() {
        doNothing().when(adminService).deleteTask(1L);

        ResponseEntity<Void> response = adminController.deleteTask(1L);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void deleteUser_success() {
        doNothing().when(adminService).deleteUserById(1L);

        ResponseEntity<Void> response = adminController.deleteUser(1L);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getTaskById_success() {
        TaskDTO taskDTO = new TaskDTO();
        when(adminService.getTaskById(1L)).thenReturn(taskDTO);

        ResponseEntity<TaskDTO> response = adminController.getTaskById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(taskDTO, response.getBody());
    }

    @Test
    void updateTask_success() {
        TaskDTO taskDTO = new TaskDTO();
        TaskDTO updatedTaskDTO = new TaskDTO();
        when(adminService.updateTask(1L, taskDTO)).thenReturn(updatedTaskDTO);

        ResponseEntity<?> response = adminController.updateTask(1L, taskDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedTaskDTO, response.getBody());
    }

    @Test
    void updateTask_notFound() {
        TaskDTO taskDTO = new TaskDTO();
        when(adminService.updateTask(1L, taskDTO)).thenReturn(null);

        ResponseEntity<?> response = adminController.updateTask(1L, taskDTO);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void searchTask_success() {
        TaskDTO taskDTO = new TaskDTO();
        when(adminService.searchTasksByUserTitle("title")).thenReturn(List.of(taskDTO));

        ResponseEntity<List<TaskDTO>> response = adminController.searchTask("title");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void createComment_success() {
        CommentDTO commentDTO = new CommentDTO();
        when(adminService.createComment(1L, "content")).thenReturn(commentDTO);

        ResponseEntity<CommentDTO> response = adminController.createComment(1L, "content");

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(commentDTO, response.getBody());
    }

    @Test
    void createComment_badRequest() {
        when(adminService.createComment(1L, "content")).thenReturn(null);

        ResponseEntity<CommentDTO> response = adminController.createComment(1L, "content");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void getCommentsByTaskId_success() {
        CommentDTO commentDTO = new CommentDTO();
        when(adminService.getCommentsByTaskId(1L)).thenReturn(List.of(commentDTO));

        ResponseEntity<List<CommentDTO>> response = adminController.getCommentsByTaskId(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void createTechnique_success() {
        TechniqueDTO dto = new TechniqueDTO();
        when(techniqueService.createTechnique(dto)).thenReturn(dto);

        ResponseEntity<TechniqueDTO> response = adminController.createTechnique(dto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void updateTechnique_success() {
        TechniqueDTO dto = new TechniqueDTO();
        when(techniqueService.updateTechnique(1L, dto)).thenReturn(dto);

        ResponseEntity<TechniqueDTO> response = adminController.updateTechnique(1L, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void deleteTechnique_success() {
        doNothing().when(techniqueService).deleteTechnique(1L);

        ResponseEntity<Void> response = adminController.deleteTechnique(1L);

        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void createTask_emptyTitleOrDescription_returnsBadRequest() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("");
        taskDTO.setDescription("");

        when(adminService.createTask(taskDTO)).thenReturn(null);

        ResponseEntity<TaskDTO> response = adminController.createTask(taskDTO);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void updateTask_emptyTitleOrDescription_returnsNotFound() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("");
        taskDTO.setDescription("");

        when(adminService.updateTask(1L, taskDTO)).thenReturn(null);

        ResponseEntity<?> response = adminController.updateTask(1L, taskDTO);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void assignTechnique_success() {

        Long techniqueId = 1L;
        TechniqueDTO dto = new TechniqueDTO();
        dto.setName("Pomodoro");
        dto.setDescription("Time management technique");

        when(techniqueService.updateTechnique(techniqueId, dto)).thenReturn(dto);

        ResponseEntity<TechniqueDTO> response = adminController.updateTechnique(techniqueId, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Pomodoro", response.getBody().getName());
        assertEquals("Time management technique", response.getBody().getDescription());

        verify(techniqueService, times(1)).updateTechnique(techniqueId, dto);
    }

    @Test
    void updateTechnique_Task_success() {
        Long techniqueId = 1L;
        TechniqueDTO dto = new TechniqueDTO();
        dto.setName("Pomodoro");
        dto.setDescription("Time management technique");

        when(techniqueService.updateTechnique(techniqueId, dto)).thenReturn(dto);

        ResponseEntity<TechniqueDTO> response = adminController.updateTechnique(techniqueId, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("Pomodoro", response.getBody().getName());
        assertEquals("Time management technique", response.getBody().getDescription());

        verify(techniqueService, times(1)).updateTechnique(techniqueId, dto);
    }


    @Test
    void getUsers_accessDenied_forNonAdmin() {
        when(adminService.getUsers()).thenThrow(new SecurityException("Access denied"));

        SecurityException exception = assertThrows(SecurityException.class, () -> adminController.getUsers());

        assertEquals("Access denied", exception.getMessage());
        verify(adminService, times(1)).getUsers();
    }

    @Test
    void updateUser_invalidEmailOrPassword_throwsError() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setEmail("invalid-email");
        dto.setPassword("123");

        when(adminService.updateUserById(1L, dto)).thenThrow(new IllegalArgumentException("Invalid email or password"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> adminController.updateUser(1L, dto));

        assertEquals("Invalid email or password", exception.getMessage());
        verify(adminService, times(1)).updateUserById(1L, dto);
    }

    @Test
    void updateMyProfile_invalidEmailOrPassword_throwsError() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setEmail("invalid-email");
        dto.setPassword("123");
        when(adminService.updateMyProfile(dto)).thenThrow(new IllegalArgumentException("Invalid email or password"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> adminController.updateMyProfile(dto));

        assertEquals("Invalid email or password", exception.getMessage());
        verify(adminService, times(1)).updateMyProfile(dto);
    }

    @Test
    void getUserById_accessDeniedForNonAdmin_throwsError() {
        when(adminService.getUserById(1L))
                .thenThrow(new SecurityException("Access denied"));

        SecurityException exception = assertThrows(SecurityException.class,
                () -> adminController.getUserById(1L));

        assertEquals("Access denied", exception.getMessage());
        verify(adminService, times(1)).getUserById(1L);
    }


}
