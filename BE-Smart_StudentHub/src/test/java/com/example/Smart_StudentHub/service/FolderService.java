package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.FolderDTO;
import com.example.Smart_StudentHub.entities.Folder;
import com.example.Smart_StudentHub.repositories.FolderRepository;
import com.example.Smart_StudentHub.services.folder.FolderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FolderServiceTest {

    @Mock
    private FolderRepository folderRepository;

    @InjectMocks
    private FolderService folderService;

    @BeforeEach
    void setup() throws Exception {
        MockitoAnnotations.openMocks(this);

        Field field = FolderService.class.getDeclaredField("uploadDir");
        field.setAccessible(true);
        field.set(folderService, System.getProperty("java.io.tmpdir") + "/testUploads");
    }

    @Test
    void createFolder_success() throws IOException {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setName("TestFolder");
        folder.setPublic(true);
        folder.setUserId(1L);

        when(folderRepository.save(any(Folder.class))).thenReturn(folder);

        FolderDTO dto = new FolderDTO();
        dto.setName("TestFolder");
        dto.setPublic(true);
        dto.setUserId(1L);

        FolderDTO result = folderService.createFolder(dto);

        assertNotNull(result);
        assertEquals("TestFolder", result.getName());
        assertEquals(1L, result.getId());
        assertTrue(Files.exists(Path.of(System.getProperty("java.io.tmpdir"), "testUploads", "1", "1")));
    }

    @Test
    void getAllFolders_success() throws IOException {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setName("Folder1");

        when(folderRepository.findAll()).thenReturn(List.of(folder));

        List<FolderDTO> result = folderService.getAllFolders();

        assertEquals(1, result.size());
        assertEquals("Folder1", result.get(0).getName());
    }

    @Test
    void getUserFolders_success() {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setUserId(1L);

        when(folderRepository.findByUserId(1L)).thenReturn(List.of(folder));

        List<FolderDTO> result = folderService.getUserFolders(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUserId());
    }

    @Test
    void getPublicFolders_success() {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setPublic(true);

        when(folderRepository.findByIsPublicTrue()).thenReturn(List.of(folder));

        List<FolderDTO> result = folderService.getPublicFolders();

        assertEquals(1, result.size());
        assertTrue(result.get(0).isPublic());
    }

    @Test
    void updateFolder_success() {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setName("OldName");
        folder.setPublic(false);

        when(folderRepository.findById(1L)).thenReturn(Optional.of(folder));
        when(folderRepository.save(any(Folder.class))).thenReturn(folder);

        FolderDTO dto = new FolderDTO();
        dto.setName("NewName");
        dto.setPublic(true);

        FolderDTO result = folderService.updateFolder(1L, dto);

        assertEquals("NewName", result.getName());
        assertTrue(result.isPublic());
    }

    @Test
    void deleteFolder_success() throws IOException {
        Folder folder = new Folder();
        folder.setId(1L);
        folder.setUserId(1L);

        Path folderPath = Path.of(System.getProperty("java.io.tmpdir"), "testUploads", "1", "1");
        Files.createDirectories(folderPath);

        when(folderRepository.findById(1L)).thenReturn(Optional.of(folder));

        folderService.deleteFolder(1L);

        assertFalse(Files.exists(folderPath));
        verify(folderRepository, times(1)).delete(folder);
    }

    @Test
    void deleteFolder_notFound_throwsException() {
        when(folderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> folderService.deleteFolder(1L));
    }
}
