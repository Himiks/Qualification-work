package com.example.Smart_StudentHub.controller.folder;

import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.dto.FolderDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FileRepository;
import com.example.Smart_StudentHub.repositories.FolderRepository;
import com.example.Smart_StudentHub.services.file.FileService;
import com.example.Smart_StudentHub.services.folder.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ✅ Создание папки
    @PostMapping
    public FolderDTO createFolder(@RequestBody FolderDTO folderDTO) throws Exception {
        return folderService.createFolder(folderDTO);
    }

    // ✅ Получение всех папок пользователя
    @GetMapping
    public List<FolderDTO> getUserFolders(@RequestParam Long userId) {
        return folderService.getUserFolders(userId);
    }

    // ✅ Публичные папки
    @GetMapping("/public")
    public List<FolderDTO> getPublicFolders() {
        return folderService.getPublicFolders();
    }

    // ✅ Загрузка файла в папку
    @PostMapping("/{id}/upload")
    public FileDTO uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return fileService.uploadFile(id, file);
    }

    // ✅ Получение файлов внутри папки
    @GetMapping("/{id}/files")
    public List<FileDTO> getFilesInFolder(@PathVariable Long id) {
        return fileService.getFilesInFolder(id);
    }

    // ✅ Скачивание файла (всё в этом же контроллере)
    @GetMapping("/file/{id}/download")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Long id) throws IOException {
        FileEntity fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found in database"));

        Folder folder = fileEntity.getFolder();
        if (folder == null) {
            throw new RuntimeException("Folder not found for file");
        }

        Path filePath = Paths.get(uploadDir, folder.getUserId().toString(),
                folder.getId().toString(), fileEntity.getFileName());

        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk: " + filePath);
        }

        InputStreamResource resource = new InputStreamResource(Files.newInputStream(filePath));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(fileEntity.getFileType()))
                .contentLength(Files.size(filePath))
                .body(resource);
    }
}
