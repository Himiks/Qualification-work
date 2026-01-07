package com.example.Smart_StudentHub.service;

import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.example.Smart_StudentHub.entities.Expense;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.repositories.ExpenseRepository;
import com.example.Smart_StudentHub.repositories.UserRepository;
import com.example.Smart_StudentHub.services.expense.ExpenseServiceImpl;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExpenseServiceImplTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private User user;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
    }

    @Test
    void uploadExcel_success() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Date");
        header.createCell(1).setCellValue("Category");
        header.createCell(2).setCellValue("Description");
        header.createCell(3).setCellValue("Amount");

        Row row = sheet.createRow(1);
        row.createCell(0).setCellValue("2026-01-02");
        row.createCell(1).setCellValue("Food");
        row.createCell(2).setCellValue("Lunch");
        row.createCell(3).setCellValue(12.5);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();

        MultipartFile file = new MockMultipartFile("file.xlsx", "file.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bos.toByteArray());

        when(expenseRepository.findByUserIdAndDateAndCategoryAndDescriptionAndAmount(anyLong(), any(), any(), any(), anyDouble()))
                .thenReturn(Optional.empty());

        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<ExpenseDTO> result = expenseService.uploadExcel(file, 1L);

        assertEquals(1, result.size());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void getAllExpensesByUser_success() {
        User user = new User();
        user.setId(1L);

        Expense expense = new Expense();
        expense.setId(1L);
        expense.setUser(user);

        when(expenseRepository.findByUserId(1L)).thenReturn(List.of(expense));

        List<ExpenseDTO> result = expenseService.getAllExpensesByUser(1L);

        assertEquals(1, result.size());
    }


    @Test
    void getExpensesByCategory_success() {
        User user = new User();
        user.setId(1L);
        Expense expense = new Expense();
        expense.setId(1L);
        expense.setUser(user);

        when(expenseRepository.findAllByUserIdAndCategory(1L, "Food")).thenReturn(List.of(expense));

        List<ExpenseDTO> result = expenseService.getExpensesByCategory(1L, "Food");

        assertEquals(1, result.size());
    }

    @Test
    void getExpensesByDateRange_success() {
        User user = new User();
        user.setId(1L);
        Expense expense = new Expense();
        expense.setId(1L);
        expense.setUser(user);

        Date start = new Date();
        Date end = new Date();
        when(expenseRepository.findAllByUserIdAndDateBetween(1L, start, end)).thenReturn(List.of(expense));

        List<ExpenseDTO> result = expenseService.getExpensesByDateRange(1L, start, end);

        assertEquals(1, result.size());
    }

    @Test
    void deleteExpense_success() throws Exception {
        Expense expense = new Expense();
        expense.setId(1L);
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));

        expenseService.deleteExpense(1L);

        verify(expenseRepository, times(1)).delete(expense);
    }

    @Test
    void deleteExpense_notFound() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(Exception.class, () -> expenseService.deleteExpense(1L));
        assertEquals("Expense not found", ex.getMessage());
    }
}
