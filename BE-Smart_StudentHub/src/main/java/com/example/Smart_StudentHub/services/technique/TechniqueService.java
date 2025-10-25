package com.example.Smart_StudentHub.services.technique;

import com.example.Smart_StudentHub.dto.TechniqueDTO;

import java.util.List;

public interface TechniqueService {
    List<TechniqueDTO> getAllTechniques();
    TechniqueDTO getTechniqueByName(String name);
}
