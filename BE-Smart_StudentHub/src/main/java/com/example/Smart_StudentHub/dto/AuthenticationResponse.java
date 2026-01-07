package com.example.Smart_StudentHub.dto;


import com.example.Smart_StudentHub.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse { // dto for auth response
    private String jwt;

    private Long userId;

    private UserRole userRole;

}
