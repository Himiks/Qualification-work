package com.example.Smart_StudentHub.config;

import com.example.Smart_StudentHub.services.jwt.UserService;
import com.example.Smart_StudentHub.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter { // Spring auto-detects and injects this filter

    private final JwtUtils jwtUtils; // token

    private final UserService userService; // user from database


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException { // This method runs for every HTTP request.
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // extracts http token
        final String userEmail = jwtUtils.extractUsername(jwt); // extracts user email from token


        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) { // authenticate user
            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userEmail); // load user details
            if (jwtUtils.isTokenValid(jwt, userDetails)) { // validates token
                UsernamePasswordAuthenticationToken authToken = // creates authentication token
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken); // stores authentication context
            }
        }

        filterChain.doFilter(request, response); // continues filter chain
    }
    }
