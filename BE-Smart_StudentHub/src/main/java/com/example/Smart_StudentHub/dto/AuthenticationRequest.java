package com.example.Smart_StudentHub.dto;


import lombok.Data;

@Data
public class AuthenticationRequest {

    private String email;
    private String password;
}
