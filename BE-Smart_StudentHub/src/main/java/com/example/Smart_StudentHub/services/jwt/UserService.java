package com.example.Smart_StudentHub.services.jwt;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService { // user service layer

    UserDetailsService userDetailsService();

}
