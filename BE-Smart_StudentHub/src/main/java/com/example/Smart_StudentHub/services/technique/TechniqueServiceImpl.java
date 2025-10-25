package com.example.Smart_StudentHub.services.technique;

import com.example.Smart_StudentHub.dto.TechniqueDTO;
import com.example.Smart_StudentHub.entities.Technique;
import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import com.example.Smart_StudentHub.repositories.TechniqueRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TechniqueServiceImpl implements TechniqueService {

    private final TechniqueRepository techniqueRepository;

    @Override
    public List<TechniqueDTO> getAllTechniques() {
        return techniqueRepository.findAll()
                .stream()
                .map(Technique::getTechniqueDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TechniqueDTO getTechniqueByName(String name) {
        return techniqueRepository.findByNameIgnoreCase(name)
                .map(Technique::getTechniqueDTO)
                .orElseThrow(() -> new EntityNotFoundException("Technique not found: " + name));
    }


}
