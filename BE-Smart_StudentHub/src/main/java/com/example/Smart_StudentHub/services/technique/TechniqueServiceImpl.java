package com.example.Smart_StudentHub.services.technique;

import com.example.Smart_StudentHub.dto.TechniqueDTO;
import com.example.Smart_StudentHub.entities.Technique;
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
    public List<TechniqueDTO> getAllTechniques() {     // Returns a list of all techniques in the system as DTOs
        return techniqueRepository.findAll()
                .stream()
                .map(Technique::getTechniqueDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TechniqueDTO getTechniqueByName(String name) {     // Retrieves a technique by its name (case-insensitive) or throws an exception if not found
        return techniqueRepository.findByNameIgnoreCase(name)
                .map(Technique::getTechniqueDTO)
                .orElseThrow(() -> new EntityNotFoundException("Technique not found: " + name));
    }

    @Override
    public TechniqueDTO createTechnique(TechniqueDTO dto) {     // Creates a new technique in the database and returns it as a DTO
        Technique technique = new Technique();
        technique.setName(dto.getName());
        technique.setDescription(dto.getDescription());
        technique.setSteps(dto.getSteps());
        return techniqueRepository.save(technique).getTechniqueDTO();
    }

    @Override
    public TechniqueDTO updateTechnique(Long id, TechniqueDTO dto) {     // Updates an existing technique’s description and steps by ID, then returns the updated DTO
        Technique technique = techniqueRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Technique not found"));

        technique.setDescription(dto.getDescription());
        technique.setSteps(dto.getSteps());
        return techniqueRepository.save(technique).getTechniqueDTO();
    }

    @Override
    public void deleteTechnique(Long id) {
        techniqueRepository.deleteById(id);
    }     // Deletes a technique by its ID from the database


}
