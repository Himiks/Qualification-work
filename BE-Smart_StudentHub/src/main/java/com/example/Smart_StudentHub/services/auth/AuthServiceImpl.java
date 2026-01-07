package com.example.Smart_StudentHub.services.auth;


import com.example.Smart_StudentHub.dto.SignupRequest;
import com.example.Smart_StudentHub.dto.UserDto;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.enums.UserRole;
import com.example.Smart_StudentHub.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    // Runs once at application startup
    // Checks if an ADMIN user exists; if not, creates a default admin account
    @PostConstruct
    public void createAnAdminAccount(){
        Optional<User> optionalUser = userRepository.findByUserRole(UserRole.ADMIN);
        if(optionalUser.isEmpty()){
            User user = new User();
            user.setEmail("admin@test.com");
            user.setName("admin");
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            user.setUserRole(UserRole.ADMIN);
            userRepository.save(user);
            System.out.println("Admin Account Created");
        }else {
            System.out.println("Admin account already exists!");
        }


    }

    // Creates a new user with EMPLOYEE role, hashes the password
    // Saves user to the database and returns as a DTO
    @Override
    public UserDto signupUser(SignupRequest signupRequest) {
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setUserRole(UserRole.EMPLOYEE);
        User createdUser = userRepository.save(user);

        return createdUser.getUserDto();
    }

    // Checks if a user already exists in the database with the given email
    // Returns true if email is already taken
    @Override
    public boolean hasUserWithEmail(String email) {
       return userRepository.findFirstByEmail(email).isPresent();
    }


}
