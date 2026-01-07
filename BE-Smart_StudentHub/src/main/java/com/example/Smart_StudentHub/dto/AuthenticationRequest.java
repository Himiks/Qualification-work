package com.example.Smart_StudentHub.dto;


import lombok.Data;

@Data
public class AuthenticationRequest { // dto for auth request

    private String email;
    private String password;
}
