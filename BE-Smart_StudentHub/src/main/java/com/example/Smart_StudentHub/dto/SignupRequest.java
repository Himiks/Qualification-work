package com.example.Smart_StudentHub.dto;

import lombok.Data;

@Data
public class SignupRequest { // dto for signup request
    private String name;
    private String email;
    private String password;
}
