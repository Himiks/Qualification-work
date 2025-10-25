package com.example.Smart_StudentHub.controller.technique;


import com.example.Smart_StudentHub.dto.TechniqueDTO;
import com.example.Smart_StudentHub.services.technique.TechniqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/techniques")
@RequiredArgsConstructor
public class TechniqueController {
    private final TechniqueService techniqueService;


    @GetMapping
    public ResponseEntity<List<TechniqueDTO>> getAllTechniques() {
        return ResponseEntity.ok(techniqueService.getAllTechniques());
    }

    @GetMapping("/technique/{name}")
    public ResponseEntity<TechniqueDTO> getTechniqueByName(@PathVariable String name) {
        return ResponseEntity.ok(techniqueService.getTechniqueByName(name));
    }

}
