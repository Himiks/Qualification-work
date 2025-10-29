package com.example.Smart_StudentHub.entities;


import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;

    private String category;

    private String description;

    private Double amount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;


    public ExpenseDTO getExpenseDTO(){
        ExpenseDTO expenseDTO = new ExpenseDTO();
        expenseDTO.setId(this.id);
        expenseDTO.setDate(this.date);
        expenseDTO.setCategory(this.category);
        expenseDTO.setDescription(this.description);
        expenseDTO.setAmount(this.amount);
        expenseDTO.setUserId(this.user.getId());
        expenseDTO.setUserName(this.user.getName());
        return expenseDTO;

    }


}
