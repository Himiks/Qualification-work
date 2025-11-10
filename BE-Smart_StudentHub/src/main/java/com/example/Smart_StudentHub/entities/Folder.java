package com.example.Smart_StudentHub.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean isPublic;

    private Long userId;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> files;


}
