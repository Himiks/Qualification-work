package com.example.Smart_StudentHub.controller.auth;


import com.example.Smart_StudentHub.dto.AuthenticationRequest;
import com.example.Smart_StudentHub.dto.AuthenticationResponse;
import com.example.Smart_StudentHub.dto.SignupRequest;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.services.auth.AuthService;
import com.example.Smart_StudentHub.services.jwt.UserService;
import com.example.Smart_StudentHub.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // authentication api
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService; // handles sign up logic

    private final UserRepository userRepository; // access database

    private final JwtUtils jwtUtils; // generates and validate token

    private final UserService userService; // provides spring security user detail

    private final AuthenticationManager authenticationManager; // performs login by validation credentials


    @PostMapping("/signup") // signs up a user
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) {
        if(authService.hasUserWithEmail(signupRequest.getEmail()))
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User already exists with this email");
        UserDto createdUserDto = authService.signupUser(signupRequest);
        if(createdUserDto == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not created");
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDto);



    }

    @PostMapping("/login") // logins a user
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
           // Create an authentication token with email and password,
            // then pass it to AuthenticationManager to validate credentials
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())); // Authenticate user credentials using Spring Security

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        //Load user details required for JWT generation
        final UserDetails userDetails = userService.userDetailsService().loadUserByUsername(authenticationRequest.getEmail());
        Optional<User> optionalUser =  userRepository.findFirstByEmail(authenticationRequest.getEmail());     // Fetch the full User entity from database (to get id and role)

        final String jwtToken = jwtUtils.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse(); // Prepare the response object

        if(optionalUser.isPresent()){ // user exists in DB, set JWT, user ID, and role in response
            authenticationResponse.setJwt(jwtToken);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
        }
        return authenticationResponse;


    }
}
