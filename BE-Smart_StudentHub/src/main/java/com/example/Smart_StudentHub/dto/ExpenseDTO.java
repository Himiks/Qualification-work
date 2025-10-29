package com.example.Smart_StudentHub.dto;


import lombok.Data;

import java.util.Date;

@Data
public class ExpenseDTO {
    private Long id;
    private Date date;
    private String category;
    private String description;
    private Double amount;
    private Long userId;
    private String userName;


}
