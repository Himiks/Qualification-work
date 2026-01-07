package com.example.Smart_StudentHub.entities;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class FileEntity { // file entity for the database
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private Long size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;
}
