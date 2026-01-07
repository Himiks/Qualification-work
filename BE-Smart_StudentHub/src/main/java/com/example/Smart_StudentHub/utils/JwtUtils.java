package com.example.Smart_StudentHub.utils;

import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final UserRepository userRepository;

    public String generateToken(UserDetails userDetails) {     // Generates a JWT token for a user with no extra claims
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {     // Generates a JWT token for a user including any additional claims (like roles or metadata)
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getSigningKey() {     // Returns the secret key used to sign and verify JWT tokens
        byte[] keyBytes = Decoders.BASE64.decode("413F4428472B4B6250655368566D5970337336763979244226452948404D6351");
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {     // Checks if the JWT token belongs to the given user and is not expired
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }     // Extracts the username (subject) from the JWT token

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }     // Checks whether the JWT token has expired

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }     // Extracts the expiration date from the JWT token


    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {     // Extracts any specific claim from the JWT token using a claims resolver function
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {     // Extracts all claims (payload data) from the JWT token
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    public User getLoggedInUser(){     // Retrieves the currently authenticated user from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()){
            User user = (User) authentication.getPrincipal();
          Optional<User> optionalUser = userRepository.findById(user.getId());
          return optionalUser.orElse(null);
        }

        return null;

    }

}
