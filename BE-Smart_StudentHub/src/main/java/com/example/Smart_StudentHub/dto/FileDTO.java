package com.example.Smart_StudentHub.dto;

import lombok.Data;

@Data
public class FileDTO { // dto for file
    private Long id;
    private String fileName;
    private String fileType;
    private Long size;
    private Long folderId;
}
