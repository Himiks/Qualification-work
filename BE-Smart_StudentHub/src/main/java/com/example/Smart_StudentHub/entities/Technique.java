package com.example.Smart_StudentHub.entities;

import com.example.Smart_StudentHub.dto.TechniqueDTO;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Technique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;


    @Column(length = 8000)
    private String steps;


    public TechniqueDTO getTechniqueDTO(){
        TechniqueDTO techniqueDTO = new TechniqueDTO();
        techniqueDTO.setId(this.id);
        techniqueDTO.setName(this.name);
        techniqueDTO.setDescription(this.description);
        techniqueDTO.setSteps(this.steps);
        return techniqueDTO;
    }


}


