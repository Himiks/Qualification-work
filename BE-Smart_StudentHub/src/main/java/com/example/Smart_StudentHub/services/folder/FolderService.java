package com.example.Smart_StudentHub.services.folder;

import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.dto.FolderDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FolderDTO createFolder(FolderDTO folderDTO) throws IOException {
        Folder folder = folderDTOToEntity(folderDTO);
        folder = folderRepository.save(folder);

        // создаём физическую папку: uploads/{userId}/{folderId}
        Path folderPath = Paths.get(uploadDir, folder.getUserId().toString(), folder.getId().toString());
        Files.createDirectories(folderPath);

        return entityToDTO(folder);
    }

    public List<FolderDTO> getUserFolders(Long userId) {
        return folderRepository.findByUserId(userId)
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    public List<FolderDTO> getPublicFolders() {
        return folderRepository.findByIsPublicTrue()
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Преобразование Entity → DTO (добавляем файлы!)
    private FolderDTO entityToDTO(Folder folder) {
        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setPublic(folder.isPublic());
        dto.setUserId(folder.getUserId());

        if (folder.getFiles() != null && !folder.getFiles().isEmpty()) {
            dto.setFiles(folder.getFiles().stream()
                    .map(this::fileToDTO)
                    .collect(Collectors.toList()));
        } else {
            dto.setFiles(new ArrayList<>()); // чтобы на фронте не было null
        }

        return dto;
    }

    private FileDTO fileToDTO(FileEntity file) {
        FileDTO dto = new FileDTO();
        dto.setId(file.getId());
        dto.setFileName(file.getFileName());
        dto.setFileType(file.getFileType());
        dto.setSize(file.getSize());
        dto.setFolderId(file.getFolder().getId());
        return dto;
    }

    private Folder folderDTOToEntity(FolderDTO dto) {
        Folder folder = new Folder();
        folder.setName(dto.getName());
        folder.setPublic(dto.isPublic());
        folder.setUserId(dto.getUserId());
        return folder;
    }
}
