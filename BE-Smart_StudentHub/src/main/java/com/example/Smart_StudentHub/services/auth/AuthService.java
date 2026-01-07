package com.example.Smart_StudentHub.services.auth;

import com.example.Smart_StudentHub.dto.SignupRequest;
import com.example.Smart_StudentHub.dto.UserDto;

public interface AuthService { // auth service layer

    UserDto signupUser(SignupRequest signupRequest);

    boolean hasUserWithEmail(String email);
}
