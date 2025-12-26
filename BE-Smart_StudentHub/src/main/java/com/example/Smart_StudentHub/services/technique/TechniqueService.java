package com.example.Smart_StudentHub.services.technique;

import com.example.Smart_StudentHub.dto.TechniqueDTO;

import java.util.List;

public interface TechniqueService {
    List<TechniqueDTO> getAllTechniques();
    TechniqueDTO getTechniqueByName(String name);
    TechniqueDTO createTechnique(TechniqueDTO dto);
    TechniqueDTO updateTechnique(Long id, TechniqueDTO dto);
    void deleteTechnique(Long id);
}
