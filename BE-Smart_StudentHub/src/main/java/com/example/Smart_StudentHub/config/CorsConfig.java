package com.example.Smart_StudentHub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    /*

    Class configures Cross-Origin Resource Sharing for Spring Boot backend.
    It allows frontend React to make HTTP requests to backend.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // any paths
                        .allowedOriginPatterns("*") // any origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // any methods
                        .allowedHeaders("*") // any headers
                        .allowCredentials(true);
            }
        };
    }
}
