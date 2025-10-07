package com.example.Smart_StudentHub.dto;

import com.example.Smart_StudentHub.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String password;

    private UserRole userRole;
}
