package com.example.Smart_StudentHub.controller.folder;

import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.dto.FolderDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FileRepository;
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
@RequestMapping("/api/folders") // api folders
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService; // folder service layer
    private final FileService fileService; // file service layer
    private final FileRepository fileRepository; // file repository layer

    @Value("${file.upload-dir}")
    private String uploadDir; // path to file where folders and files are saved


    @PostMapping
    public FolderDTO createFolder(@RequestBody FolderDTO folderDTO) throws Exception { // creates folder
        return folderService.createFolder(folderDTO);
    }


    @GetMapping
    public List<FolderDTO> getUserFolders(@RequestParam Long userId) { // gets user folders
        return folderService.getUserFolders(userId);
    }

    @GetMapping("/all")
    public List<FolderDTO> getFolders() throws IOException { // gets a folder
        return folderService.getAllFolders();

    }


    @GetMapping("/public")
    public List<FolderDTO> getPublicFolders() { // gets public folders
        return folderService.getPublicFolders();
    }


    @PostMapping("/{id}/upload")
    public FileDTO uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException { // uploads a file
        return fileService.uploadFile(id, file);
    }


    @GetMapping("/{id}/files")
    public List<FileDTO> getFilesInFolder(@PathVariable Long id) { // gets files in a folder
        return fileService.getFilesInFolder(id);
    }

    @PutMapping("/{id}")
    public FolderDTO updateFolder(@PathVariable Long id, @RequestBody FolderDTO folderDTO) { // updates folder
        return folderService.updateFolder(id, folderDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable Long id) throws IOException { // deletes folder
        folderService.deleteFolder(id);
    }

    @PutMapping("/file/{id}")
    public FileDTO renameFile(@PathVariable Long id, @RequestParam String newName) throws IOException { // rename a file
        return fileService.renameFile(id, newName);
    }

    @DeleteMapping("/file/{id}")
    public void deleteFile(@PathVariable Long id) throws IOException { // deletes a file
        fileService.deleteFile(id);
    }


    @GetMapping("/file/{id}/download")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Long id) throws IOException { // downloads a file
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
