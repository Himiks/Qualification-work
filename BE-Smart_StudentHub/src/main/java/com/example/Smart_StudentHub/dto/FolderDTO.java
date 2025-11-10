package com.example.Smart_StudentHub.dto;


import lombok.Data;

import java.util.List;

@Data
public class FolderDTO {
    private Long id;
    private String name;
    private boolean isPublic;
    private Long userId;
    private List<FileDTO> files;
}
