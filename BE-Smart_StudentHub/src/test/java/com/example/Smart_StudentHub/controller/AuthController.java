package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.auth.AuthController;
import com.example.Smart_StudentHub.dto.*;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.services.auth.AuthService;
import com.example.Smart_StudentHub.services.jwt.UserService;
import com.example.Smart_StudentHub.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void signupUser_success() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setName("Test User");
        request.setPassword("password");

        UserDto userDto = new UserDto();
        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(false);
        when(authService.signupUser(request)).thenReturn(userDto);

        var response = authController.signupUser(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void signupUser_alreadyExists() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");

        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(true);

        var response = authController.signupUser(request);

        assertEquals(406, response.getStatusCodeValue());
        assertEquals("User already exists with this email", response.getBody());
    }

    @Test
    void signupUser_creationFails() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");

        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(false);
        when(authService.signupUser(request)).thenReturn(null);

        var response = authController.signupUser(request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not created", response.getBody());
    }


    @Test
    void signupUser_creationFailsEmail() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test.com");

        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(false);
        when(authService.signupUser(request)).thenReturn(null);

        var response = authController.signupUser(request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not created", response.getBody());
    }


    @Test
    void login_badCredentials() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@test.com");
        request.setPassword("wrong");

        doThrow(BadCredentialsException.class).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> authController.login(request));
    }


    @Test
    void login_invalidEmail() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("invalid@test.com");
        request.setPassword("password");

        UserDetailsService userDetailsServiceMock = mock(UserDetailsService.class);

        when(userService.userDetailsService()).thenReturn(userDetailsServiceMock);

        when(userDetailsServiceMock.loadUserByUsername(request.getEmail()))
                .thenThrow(new RuntimeException("User is not found"));

        assertThrows(RuntimeException.class, () -> authController.login(request));
    }


    @Test
    void login_withoutCredentials() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("");
        request.setPassword("");

        doThrow(BadCredentialsException.class).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> authController.login(request));
    }

    @Test
    void signupUser_weakPassword() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test2@test.com");
        request.setName("Test User");
        request.setPassword("123");

        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(false);

        when(authService.signupUser(request)).thenReturn(null);

        var response = authController.signupUser(request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not created", response.getBody());
    }

    @Test
    void signupUser_invalidEmail() {
        SignupRequest request = new SignupRequest();
        request.setEmail("invalid-email");
        request.setName("Test User");
        request.setPassword("password");

        when(authService.hasUserWithEmail(request.getEmail())).thenReturn(false);

        when(authService.signupUser(request)).thenReturn(null);

        var response = authController.signupUser(request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User not created", response.getBody());
    }



}
