package com.example.Smart_StudentHub.entities;


import com.example.Smart_StudentHub.dto.TaskDTO;
import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private Date dueDate;

    private String priority;

    private TaskStatus taskStatus;

    @Enumerated(EnumType.STRING)
    private TaskTechnique technique;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;


    public TaskDTO getTaskDTO() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(this.id);
        taskDTO.setTitle(this.title);
        taskDTO.setDescription(this.description);
        taskDTO.setEmployeeName(user.getName());
        taskDTO.setEmployeeId(user.getId());
        taskDTO.setDueDate(this.dueDate);
        taskDTO.setPriority(this.priority);
        taskDTO.setTaskStatus(this.taskStatus);
        taskDTO.setTechnique(this.technique);

        return taskDTO;

    }




}
