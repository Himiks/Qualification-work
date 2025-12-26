package com.example.Smart_StudentHub.services.file;

import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FileRepository;
import com.example.Smart_StudentHub.repositories.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileDTO uploadFile(Long folderId, MultipartFile file) throws IOException {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        Path folderPath = Paths.get(uploadDir, folder.getUserId().toString(), folder.getId().toString());

        if(!Files.exists(folderPath)){
            Files.createDirectories(folderPath);
        }

        Path filePath = folderPath.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FileEntity entity = new FileEntity();
        entity.setFileName(file.getOriginalFilename());
        entity.setFileType(file.getContentType());
        entity.setSize(file.getSize());
        entity.setFolder(folder);
        fileRepository.save(entity);

        return entityToDTO(entity);
    }


    public List<FileDTO> getFilesInFolder(Long folderId){
        return fileRepository.findByFolderId(folderId)
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    private FileDTO entityToDTO(FileEntity entity) {
        FileDTO dto = new FileDTO();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        dto.setFileType(entity.getFileType());
        dto.setSize(entity.getSize());
        dto.setFolderId(entity.getFolder().getId());
        return dto;
    }

    public FileDTO renameFile(Long id, String newName) throws IOException {
        FileEntity file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found!"));

        if (newName.contains("..") || newName.contains("/")) {
            throw new RuntimeException("Invalid file name");
        }

        Folder folder = file.getFolder();
        Path oldPath = Paths.get(uploadDir, folder.getUserId().toString(), folder.getId().toString(), file.getFileName());
        Path newPath = oldPath.resolveSibling(newName);



        Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);

        file.setFileName(newName);

        return entityToDTO(fileRepository.save(file));
    }

    @Transactional
    public void deleteFile(Long id) throws IOException {
        FileEntity file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found!"));

        Folder folder = file.getFolder();

        Path path = Paths.get(uploadDir, folder.getUserId().toString(), folder.getId().toString(), file.getFileName());

        Files.deleteIfExists(path);
        fileRepository.delete(file);
    }



}
