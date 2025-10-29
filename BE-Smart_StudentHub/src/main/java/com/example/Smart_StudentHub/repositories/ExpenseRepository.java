package com.example.Smart_StudentHub.repositories;

import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.example.Smart_StudentHub.entities.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
        List<Expense> findAllByUserIdAndCategory(Long userId, String category);
        List<Expense> findAllByUserIdAndDateBetween(Long userId, Date start, Date end);

}
