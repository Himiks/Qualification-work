package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.employee.EmployeeController;
import com.example.Smart_StudentHub.dto.CommentDTO;
import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.dto.UpdateUserDTO;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import com.example.Smart_StudentHub.services.employee.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeControllerTest {

    @InjectMocks
    private EmployeeController employeeController;

    @Mock
    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_success() {
        TaskDTO taskDTO = new TaskDTO();
        TaskDTO returned = new TaskDTO();
        when(employeeService.createTask(taskDTO)).thenReturn(returned);

        ResponseEntity<TaskDTO> response = employeeController.createTask(taskDTO);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(returned, response.getBody());
        verify(employeeService, times(1)).createTask(taskDTO);
    }

    @Test
    void createTask_badRequest() {
        TaskDTO taskDTO = new TaskDTO();
        when(employeeService.createTask(taskDTO)).thenReturn(null);

        ResponseEntity<TaskDTO> response = employeeController.createTask(taskDTO);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void updateComment_success() {
        CommentDTO commentDTO = new CommentDTO();
        when(employeeService.updateComment(1L, "new content")).thenReturn(commentDTO);

        ResponseEntity<CommentDTO> response = employeeController.updateComment(1L, "new content");

        assertEquals(commentDTO, response.getBody());
    }

    @Test
    void deleteComment_success() {
        doNothing().when(employeeService).deleteComment(1L);

        ResponseEntity<Void> response = employeeController.deleteComment(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(employeeService, times(1)).deleteComment(1L);
    }

    @Test
    void getTasksByUserId_success() {
        List<TaskDTO> tasks = List.of(new TaskDTO());
        when(employeeService.getTaskByUserId()).thenReturn(tasks);

        ResponseEntity<List<TaskDTO>> response = employeeController.getTasksByUserId();

        assertEquals(tasks, response.getBody());
    }

    @Test
    void deleteTask_success() {
        doNothing().when(employeeService).deleteTask(1L);

        ResponseEntity<Void> response = employeeController.deleteTask(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(employeeService).deleteTask(1L);
    }

    @Test
    void updateTask_success() {
        TaskDTO updatedTask = new TaskDTO();
        when(employeeService.updateTask(1L, updatedTask)).thenReturn(updatedTask);

        ResponseEntity<?> response = employeeController.updateTask(1L, updatedTask);

        assertEquals(updatedTask, response.getBody());
    }

    @Test
    void updateTask_notFound() {
        TaskDTO updatedTask = new TaskDTO();
        when(employeeService.updateTask(1L, updatedTask)).thenReturn(null);

        ResponseEntity<?> response = employeeController.updateTask(1L, updatedTask);

        assertEquals(404, response.getStatusCodeValue());
    }



    @Test
    void searchTask_success() {
        List<TaskDTO> tasks = List.of(new TaskDTO());
        when(employeeService.searchTasksByUserTitle("task")).thenReturn(tasks);

        ResponseEntity<List<TaskDTO>> response = employeeController.searchTask("task");

        assertEquals(tasks, response.getBody());
    }

    @Test
    void createComment_success() {
        CommentDTO commentDTO = new CommentDTO();
        when(employeeService.createComment(1L, "content")).thenReturn(commentDTO);

        ResponseEntity<CommentDTO> response = employeeController.createComment(1L, "content");

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(commentDTO, response.getBody());
    }



    @Test
    void getTaskById_success() {
        TaskDTO taskDTO = new TaskDTO();
        when(employeeService.getTaskById(1L)).thenReturn(taskDTO);

        ResponseEntity<TaskDTO> response = employeeController.getTaskById(1L);

        assertEquals(taskDTO, response.getBody());
    }



    @Test
    void getTasksByTechnique_badRequest() {
        ResponseEntity<List<TaskDTO>> response = employeeController.getTasksByTechnique("INVALID");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void createTask_emptyTitleOrDescription_returnsBadRequest() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("");
        taskDTO.setDescription("");

        when(employeeService.createTask(taskDTO)).thenReturn(null);

        ResponseEntity<TaskDTO> response = employeeController.createTask(taskDTO);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void updateTask_emptyTitleOrDescription_returnsNotFound() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("");
        taskDTO.setDescription("");

        when(employeeService.updateTask(1L, taskDTO)).thenReturn(null);

        ResponseEntity<?> response = employeeController.updateTask(1L, taskDTO);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void updateMyProfile_changeName_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setName("New Name");

        UserDto updatedUser = new UserDto();
        updatedUser.setName("New Name");

        when(employeeService.updateMyProfile(dto)).thenReturn(updatedUser);

        ResponseEntity<?> response = employeeController.updateMyProfile(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New Name", ((UserDto) response.getBody()).getName());
        verify(employeeService, times(1)).updateMyProfile(dto);
    }

    @Test
    void updateMyProfile_changeEmail_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setEmail("newemail@example.com");

        UserDto updatedUser = new UserDto();
        updatedUser.setEmail("newemail@example.com");

        when(employeeService.updateMyProfile(dto)).thenReturn(updatedUser);

        ResponseEntity<?> response = employeeController.updateMyProfile(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("newemail@example.com", ((UserDto) response.getBody()).getEmail());
        verify(employeeService, times(1)).updateMyProfile(dto);
    }

    @Test
    void updateMyProfile_changePassword_success() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setPassword("newPassword");

        UserDto updatedUser = new UserDto();
        updatedUser.setName("Existing Name");

        when(employeeService.updateMyProfile(dto)).thenReturn(updatedUser);

        ResponseEntity<?> response = employeeController.updateMyProfile(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedUser, response.getBody());
        verify(employeeService, times(1)).updateMyProfile(dto);
    }

    @Test
    void updateMyProfile_noChanges_keepsSameData() {
        UpdateUserDTO dto = new UpdateUserDTO();

        UserDto updatedUser = new UserDto();
        updatedUser.setName("Existing Name");
        updatedUser.setEmail("existing@example.com");

        when(employeeService.updateMyProfile(dto)).thenReturn(updatedUser);

        ResponseEntity<?> response = employeeController.updateMyProfile(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Existing Name", ((UserDto) response.getBody()).getName());
        assertEquals("existing@example.com", ((UserDto) response.getBody()).getEmail());
        verify(employeeService, times(1)).updateMyProfile(dto);
    }

    @Test
    void updateMyProfile_invalidEmailOrPassword_returnsError() {
        UpdateUserDTO dto = new UpdateUserDTO();
        dto.setEmail("invalid-email");
        dto.setPassword("");

        when(employeeService.updateMyProfile(dto)).thenThrow(new IllegalArgumentException("Invalid input"));

        assertThrows(IllegalArgumentException.class, () -> employeeController.updateMyProfile(dto));

        verify(employeeService, times(1)).updateMyProfile(dto);
    }

}
