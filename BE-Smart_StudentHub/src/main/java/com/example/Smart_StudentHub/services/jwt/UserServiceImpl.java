package com.example.Smart_StudentHub.services.jwt;


import com.example.Smart_StudentHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;     // Repository used to fetch user data from the database


    @Override
    public UserDetailsService userDetailsService() {         // Provides a Spring Security UserDetailsService to load users by username (email)
        return new UserDetailsService() {
            // Fetches the user from the database using email.
            // Throws UsernameNotFoundException if user does not exist.
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findFirstByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User is not found"));
            }
        };
    }
}
