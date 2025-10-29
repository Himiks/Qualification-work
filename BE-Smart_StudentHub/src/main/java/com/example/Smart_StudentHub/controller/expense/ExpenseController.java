package com.example.Smart_StudentHub.controller.expense;


import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.example.Smart_StudentHub.services.expense.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/upload/{userId}")
    public ResponseEntity<List<ExpenseDTO>> uploadExpense(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            List<ExpenseDTO> expenses = expenseService.uploadExcel(file, userId);
            return ResponseEntity.ok(expenses);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> getAllExpensesByUser() {
        return ResponseEntity.ok("Hello World");

    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ExpenseDTO>> getAllExpensesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getAllExpensesByUser(userId));
    }

    @GetMapping("/{userId}/category")
    public ResponseEntity<List<ExpenseDTO>>  getAllExpensesByCategory(@PathVariable Long userId, @RequestParam String category) {
        return ResponseEntity.ok(expenseService.getExpensesByCategory(userId, category));
    }

    @GetMapping("/{userId}/range")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date end){
        return ResponseEntity.ok(expenseService.getExpensesByDateRange(userId, start, end));
    }



}
