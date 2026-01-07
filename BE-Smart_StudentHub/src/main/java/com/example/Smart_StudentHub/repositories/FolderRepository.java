package com.example.Smart_StudentHub.repositories;

import com.example.Smart_StudentHub.entities.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> { // folder database interface
    List<Folder> findByUserId(Long userId);
    List<Folder> findByIsPublicTrue();
}
