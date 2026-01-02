package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.technique.TechniqueController;
import com.example.Smart_StudentHub.dto.TechniqueDTO;
import com.example.Smart_StudentHub.services.technique.TechniqueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TechniqueControllerTest {

    private TechniqueController techniqueController;

    @Mock
    private TechniqueService techniqueService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        techniqueController = new TechniqueController(techniqueService);
    }

    @Test
    void getAllTechniques_success() {
        TechniqueDTO t1 = new TechniqueDTO();
        t1.setName("Technique1");
        TechniqueDTO t2 = new TechniqueDTO();
        t2.setName("Technique2");

        when(techniqueService.getAllTechniques()).thenReturn(List.of(t1, t2));

        ResponseEntity<List<TechniqueDTO>> response = techniqueController.getAllTechniques();

        assertEquals(2, response.getBody().size());
        verify(techniqueService, times(1)).getAllTechniques();
    }

    @Test
    void getTechniqueByName_success() {
        String name = "Scrum";
        TechniqueDTO dto = new TechniqueDTO();
        dto.setName(name);

        when(techniqueService.getTechniqueByName(name)).thenReturn(dto);

        ResponseEntity<TechniqueDTO> response = techniqueController.getTechniqueByName(name);

        assertEquals(name, response.getBody().getName());
        verify(techniqueService, times(1)).getTechniqueByName(name);
    }
}
