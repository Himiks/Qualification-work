package com.example.Smart_StudentHub.dto;


import com.example.Smart_StudentHub.enums.TaskStatus;
import com.example.Smart_StudentHub.enums.TaskTechnique;
import lombok.Data;

import java.util.Date;

@Data
public class TaskDTO {

    private Long id;

    private String title;

    private String description;

    private Date dueDate;

    private String priority;

    private TaskStatus taskStatus;

    private Long employeeId;

    private String employeeName;


    private TaskTechnique technique;





}
