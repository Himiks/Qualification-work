package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.SignupRequest;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.enums.UserRole;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.services.auth.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signupUser_success() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@mail.com");
        request.setName("Test User");
        request.setPassword("password");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(request.getEmail());
        savedUser.setName(request.getName());
        savedUser.setUserRole(UserRole.EMPLOYEE);
        savedUser.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = authService.signupUser(request);

        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@mail.com", result.getEmail());
        assertEquals(UserRole.EMPLOYEE, savedUser.getUserRole());
    }

    @Test
    void hasUserWithEmail_true() {
        String email = "existing@mail.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findFirstByEmail(email)).thenReturn(Optional.of(user));

        assertTrue(authService.hasUserWithEmail(email));
    }

    @Test
    void hasUserWithEmail_false() {
        String email = "notfound@mail.com";

        when(userRepository.findFirstByEmail(email)).thenReturn(Optional.empty());

        assertFalse(authService.hasUserWithEmail(email));
    }

    @Test
    void createAnAdminAccount_createsAdminIfNoneExists() {
        when(userRepository.findByUserRole(UserRole.ADMIN)).thenReturn(Optional.empty());

        doAnswer(invocation -> {
            User user = invocation.getArgument(0);
            assertEquals("admin@test.com", user.getEmail());
            assertEquals("admin", user.getName());
            assertEquals(UserRole.ADMIN, user.getUserRole());
            assertNotNull(user.getPassword());
            return user;
        }).when(userRepository).save(any(User.class));

        authService.createAnAdminAccount();

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createAnAdminAccount_skipsIfAdminExists() {
        User existingAdmin = new User();
        existingAdmin.setUserRole(UserRole.ADMIN);

        when(userRepository.findByUserRole(UserRole.ADMIN)).thenReturn(Optional.of(existingAdmin));

        authService.createAnAdminAccount();

        verify(userRepository, never()).save(any(User.class));
    }
}
