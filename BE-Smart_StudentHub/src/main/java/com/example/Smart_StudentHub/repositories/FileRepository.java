package com.example.Smart_StudentHub.repositories;

import com.example.Smart_StudentHub.entities.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity,Long> {
    List<FileEntity> findByFolderId(Long folderId);
}
