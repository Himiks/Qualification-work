package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.folder.FolderController;
import com.example.Smart_StudentHub.dto.FileDTO;
import com.example.Smart_StudentHub.dto.FolderDTO;
import com.example.Smart_StudentHub.entities.FileEntity;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FileRepository;
import com.example.Smart_StudentHub.services.file.FileService;
import com.example.Smart_StudentHub.services.folder.FolderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
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

class FolderControllerTest {

    @InjectMocks
    private FolderController folderController;

    @Mock
    private FolderService folderService;

    @Mock
    private FileService fileService;

    @Mock
    private FileRepository fileRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createFolder_success() throws Exception {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName("Test Folder");
        folderDTO.setUserId(1L);

        FolderDTO savedDTO = new FolderDTO();
        savedDTO.setId(1L);
        savedDTO.setName("Test Folder");

        when(folderService.createFolder(folderDTO)).thenReturn(savedDTO);

        FolderDTO result = folderController.createFolder(folderDTO);
        assertEquals(savedDTO.getId(), result.getId());
        verify(folderService, times(1)).createFolder(folderDTO);
    }

    @Test
    void getUserFolders_success() {
        List<FolderDTO> folders = List.of(new FolderDTO());
        when(folderService.getUserFolders(1L)).thenReturn(folders);

        List<FolderDTO> result = folderController.getUserFolders(1L);
        assertEquals(folders.size(), result.size());
        verify(folderService, times(1)).getUserFolders(1L);
    }

    @Test
    void getFolders_success() throws IOException {
        List<FolderDTO> folders = List.of(new FolderDTO());
        when(folderService.getAllFolders()).thenReturn(folders);

        List<FolderDTO> result = folderController.getFolders();
        assertEquals(folders.size(), result.size());
        verify(folderService, times(1)).getAllFolders();
    }

    @Test
    void getPublicFolders_success() {
        List<FolderDTO> folders = List.of(new FolderDTO());
        when(folderService.getPublicFolders()).thenReturn(folders);

        List<FolderDTO> result = folderController.getPublicFolders();
        assertEquals(folders.size(), result.size());
        verify(folderService, times(1)).getPublicFolders();
    }

    @Test
    void uploadFile_success() throws IOException {
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());
        FileDTO fileDTO = new FileDTO();
        fileDTO.setId(1L);

        when(fileService.uploadFile(1L, file)).thenReturn(fileDTO);

        FileDTO result = folderController.uploadFile(1L, file);
        assertEquals(fileDTO.getId(), result.getId());
        verify(fileService, times(1)).uploadFile(1L, file);
    }

    @Test
    void getFilesInFolder_success() {
        List<FileDTO> files = List.of(new FileDTO());
        when(fileService.getFilesInFolder(1L)).thenReturn(files);

        List<FileDTO> result = folderController.getFilesInFolder(1L);
        assertEquals(files.size(), result.size());
        verify(fileService, times(1)).getFilesInFolder(1L);
    }

    @Test
    void updateFolder_success() {
        FolderDTO dto = new FolderDTO();
        dto.setName("Updated");
        FolderDTO updated = new FolderDTO();
        updated.setName("Updated");

        when(folderService.updateFolder(1L, dto)).thenReturn(updated);

        FolderDTO result = folderController.updateFolder(1L, dto);
        assertEquals("Updated", result.getName());
        verify(folderService, times(1)).updateFolder(1L, dto);
    }

    @Test
    void deleteFolder_success() throws IOException {
        doNothing().when(folderService).deleteFolder(1L);

        folderController.deleteFolder(1L);
        verify(folderService, times(1)).deleteFolder(1L);
    }

    @Test
    void renameFile_success() throws IOException {
        FileDTO dto = new FileDTO();
        dto.setId(1L);
        dto.setFileName("new.txt");

        when(fileService.renameFile(1L, "new.txt")).thenReturn(dto);

        FileDTO result = folderController.renameFile(1L, "new.txt");
        assertEquals("new.txt", result.getFileName());
        verify(fileService, times(1)).renameFile(1L, "new.txt");
    }

    @Test
    void deleteFile_success() throws IOException {
        doNothing().when(fileService).deleteFile(1L);

        folderController.deleteFile(1L);
        verify(fileService, times(1)).deleteFile(1L);
    }


    @Test
    void createFolder_withoutName_throwsException() throws IOException {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName("");
        folderDTO.setUserId(1L);

        when(folderService.createFolder(folderDTO))
                .thenThrow(new RuntimeException("Folder name cannot be empty"));

        Exception exception = assertThrows(RuntimeException.class, () -> folderController.createFolder(folderDTO));
        assertEquals("Folder name cannot be empty", exception.getMessage());
    }

    @Test
    void createPublicFolder_success() throws Exception {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName("Public Folder");
        folderDTO.setUserId(1L);
        folderDTO.setPublic(true);

        FolderDTO savedDTO = new FolderDTO();
        savedDTO.setId(2L);
        savedDTO.setName("Public Folder");
        savedDTO.setPublic(true);

        when(folderService.createFolder(folderDTO)).thenReturn(savedDTO);

        FolderDTO result = folderController.createFolder(folderDTO);
        assertTrue(result.isPublic());
        assertEquals(savedDTO.getId(), result.getId());
        verify(folderService, times(1)).createFolder(folderDTO);
    }

    @Test
    void createPrivateFolder_success() throws Exception {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName("Private Folder");
        folderDTO.setUserId(1L);
        folderDTO.setPublic(false);

        FolderDTO savedDTO = new FolderDTO();
        savedDTO.setId(3L);
        savedDTO.setName("Private Folder");
        savedDTO.setPublic(false);

        when(folderService.createFolder(folderDTO)).thenReturn(savedDTO);

        FolderDTO result = folderController.createFolder(folderDTO);
        assertFalse(result.isPublic());
        assertEquals(savedDTO.getId(), result.getId());
        verify(folderService, times(1)).createFolder(folderDTO);
    }

    @Test
    void uploadFile_emptyFile_throwsException() throws IOException {
        MultipartFile emptyFile = new MockMultipartFile("file", "", "text/plain", new byte[0]);

        when(fileService.uploadFile(1L, emptyFile))
                .thenThrow(new RuntimeException("File is empty"));

        Exception exception = assertThrows(RuntimeException.class, () -> folderController.uploadFile(1L, emptyFile));
        assertEquals("File is empty", exception.getMessage());
    }



}
