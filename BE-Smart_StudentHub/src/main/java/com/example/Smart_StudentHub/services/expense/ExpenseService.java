package com.example.Smart_StudentHub.services.expense;

import com.example.Smart_StudentHub.dto.ExpenseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

public interface ExpenseService {
    List<ExpenseDTO> uploadExcel(MultipartFile file, Long userId) throws Exception;
    List<ExpenseDTO> getAllExpensesByUser(Long userId);
    List<ExpenseDTO> getExpensesByCategory(Long userId, String category);
    List<ExpenseDTO> getExpensesByDateRange(Long userId, Date start, Date end);
}
