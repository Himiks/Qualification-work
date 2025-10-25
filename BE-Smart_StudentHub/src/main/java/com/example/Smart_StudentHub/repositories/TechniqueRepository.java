package com.example.Smart_StudentHub.repositories;

import com.example.Smart_StudentHub.entities.Technique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechniqueRepository extends JpaRepository<Technique, Long> {
    Optional<Technique> findByNameIgnoreCase(String name);
}