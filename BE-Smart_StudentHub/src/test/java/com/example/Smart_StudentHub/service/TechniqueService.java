package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.TechniqueDTO;
import com.example.Smart_StudentHub.entities.Technique;
import com.example.Smart_StudentHub.repositories.TechniqueRepository;
import com.example.Smart_StudentHub.services.technique.TechniqueServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TechniqueServiceImplTest {

    @Mock
    private TechniqueRepository techniqueRepository;

    @InjectMocks
    private TechniqueServiceImpl techniqueService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTechniques_success() {
        Technique technique = new Technique();
        technique.setId(1L);
        technique.setName("TestTechnique");

        when(techniqueRepository.findAll()).thenReturn(List.of(technique));

        List<TechniqueDTO> result = techniqueService.getAllTechniques();

        assertEquals(1, result.size());
        assertEquals("TestTechnique", result.get(0).getName());
    }

    @Test
    void getTechniqueByName_found() {
        Technique technique = new Technique();
        technique.setName("Skill1");

        when(techniqueRepository.findByNameIgnoreCase("Skill1")).thenReturn(Optional.of(technique));

        TechniqueDTO result = techniqueService.getTechniqueByName("Skill1");

        assertNotNull(result);
        assertEquals("Skill1", result.getName());
    }

    @Test
    void getTechniqueByName_notFound_throwsException() {
        when(techniqueRepository.findByNameIgnoreCase("Unknown")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> techniqueService.getTechniqueByName("Unknown"));
    }

    @Test
    void createTechnique_success() {
        TechniqueDTO dto = new TechniqueDTO();
        dto.setName("NewTech");
        dto.setDescription("Description");
        dto.setSteps("Step1, Step2");

        Technique saved = new Technique();
        saved.setId(1L);
        saved.setName(dto.getName());
        saved.setDescription(dto.getDescription());
        saved.setSteps(dto.getSteps());

        when(techniqueRepository.save(any(Technique.class))).thenReturn(saved);

        TechniqueDTO result = techniqueService.createTechnique(dto);

        assertNotNull(result);
        assertEquals("NewTech", result.getName());
        assertEquals("Description", result.getDescription());
    }

    @Test
    void updateTechnique_success() {
        Technique technique = new Technique();
        technique.setId(1L);
        technique.setDescription("OldDesc");
        technique.setSteps("OldSteps");

        TechniqueDTO dto = new TechniqueDTO();
        dto.setDescription("NewDesc");
        dto.setSteps("NewSteps");

        when(techniqueRepository.findById(1L)).thenReturn(Optional.of(technique));
        when(techniqueRepository.save(any(Technique.class))).thenReturn(technique);

        TechniqueDTO result = techniqueService.updateTechnique(1L, dto);

        assertNotNull(result);
        assertEquals("NewDesc", result.getDescription());
        assertEquals("NewSteps", result.getSteps());
    }

    @Test
    void updateTechnique_notFound_throwsException() {
        when(techniqueRepository.findById(1L)).thenReturn(Optional.empty());

        TechniqueDTO dto = new TechniqueDTO();
        assertThrows(EntityNotFoundException.class,
                () -> techniqueService.updateTechnique(1L, dto));
    }

    @Test
    void deleteTechnique_callsRepository() {
        doNothing().when(techniqueRepository).deleteById(1L);

        techniqueService.deleteTechnique(1L);

        verify(techniqueRepository, times(1)).deleteById(1L);
    }
}
