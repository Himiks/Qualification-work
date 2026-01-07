package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FileRepository;
import com.example.Smart_StudentHub.repositories.FolderRepository;
import com.example.Smart_StudentHub.services.file.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.mockito.MockedStatic;

class FileServiceTest {

    @Mock
    private FileRepository fileRepository;

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private MultipartFile multipartFile;

    private FileService fileService;

    @BeforeEach
    void setup() throws Exception {
        MockitoAnnotations.openMocks(this);
        fileService = new FileService(fileRepository, folderRepository);

        Field uploadDirField = FileService.class.getDeclaredField("uploadDir");
        uploadDirField.setAccessible(true);
        uploadDirField.set(fileService, "/tmp/uploads");
    }

    @Test
    void uploadFile_success() throws Exception {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setUserId(2L);

        when(folderRepository.findById(1L)).thenReturn(Optional.of(folder));
        when(multipartFile.getOriginalFilename()).thenReturn("test.txt");
        when(multipartFile.getContentType()).thenReturn("text/plain");
        when(multipartFile.getSize()).thenReturn(10L);
        when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream("hello".getBytes()));

        FileEntity savedFile = new FileEntity();
        savedFile.setId(1L);
        savedFile.setFileName("test.txt");
        savedFile.setFolder(folder);

        when(fileRepository.save(any(FileEntity.class))).thenReturn(savedFile);

        try (MockedStatic<Files> filesMock = mockStatic(Files.class)) {
            filesMock.when(() -> Files.exists(any(Path.class))).thenReturn(true);
            filesMock.when(() -> Files.createDirectories(any(Path.class))).thenReturn(null);
            filesMock.when(() -> Files.copy((Path) any(), any(), any())).thenReturn(null);

            FileDTO dto = fileService.uploadFile(1L, multipartFile);

            assertNotNull(dto);
            assertEquals("test.txt", dto.getFileName());
        }
    }

    @Test
    void getFilesInFolder_success() {
        Folder folder = new Folder();
        folder.setId(1L);

        FileEntity file = new FileEntity();
        file.setId(1L);
        file.setFileName("file1.txt");
        file.setFolder(folder);

        when(fileRepository.findByFolderId(1L)).thenReturn(List.of(file));

        List<FileDTO> files = fileService.getFilesInFolder(1L);

        assertEquals(1, files.size());
        assertEquals("file1.txt", files.get(0).getFileName());
    }

    @Test
    void renameFile_success() throws IOException {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setUserId(2L);

        FileEntity file = new FileEntity();
        file.setId(1L);
        file.setFileName("old.txt");
        file.setFolder(folder);

        when(fileRepository.findById(1L)).thenReturn(Optional.of(file));
        when(fileRepository.save(any(FileEntity.class))).thenReturn(file);

        try (MockedStatic<Files> filesMock = mockStatic(Files.class)) {
            filesMock.when(() -> Files.move(any(), any(), any())).thenReturn(null);

            FileDTO dto = fileService.renameFile(1L, "new.txt");

            assertNotNull(dto);
            assertEquals("new.txt", dto.getFileName());
        }
    }

    @Test
    void deleteFile_success() throws IOException {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setUserId(2L);

        FileEntity file = new FileEntity();
        file.setId(1L);
        file.setFileName("file.txt");
        file.setFolder(folder);

        when(fileRepository.findById(1L)).thenReturn(Optional.of(file));

        try (MockedStatic<Files> filesMock = mockStatic(Files.class)) {
            filesMock.when(() -> Files.deleteIfExists(any())).thenReturn(true);

            fileService.deleteFile(1L);

            verify(fileRepository, times(1)).delete(file);
        }
    }
}
