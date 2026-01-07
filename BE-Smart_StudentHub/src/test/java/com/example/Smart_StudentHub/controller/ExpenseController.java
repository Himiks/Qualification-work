package com.example.Smart_StudentHub.controller;

import com.example.Smart_StudentHub.controller.expense.ExpenseController;
import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.example.Smart_StudentHub.services.expense.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExpenseControllerTest {

    @InjectMocks
    private ExpenseController expenseController;

    @Mock
    private ExpenseService expenseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadExpense_success() throws Exception {
        MultipartFile file = new MockMultipartFile("file", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new byte[]{});
        List<ExpenseDTO> expenses = List.of(new ExpenseDTO());

        when(expenseService.uploadExcel(file, 1L)).thenReturn(expenses);

        ResponseEntity<List<ExpenseDTO>> response = expenseController.uploadExpense(1L, file);

        assertEquals(expenses, response.getBody());
        verify(expenseService, times(1)).uploadExcel(file, 1L);
    }

    @Test
    void uploadExpense_exception() throws Exception {
        MultipartFile file = new MockMultipartFile("file", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new byte[]{});
        when(expenseService.uploadExcel(file, 1L)).thenThrow(new Exception("error"));

        ResponseEntity<List<ExpenseDTO>> response = expenseController.uploadExpense(1L, file);

        assertEquals(400, response.getStatusCodeValue());
    }



    @Test
    void getAllExpensesByUser_success() {
        List<ExpenseDTO> expenses = List.of(new ExpenseDTO());
        when(expenseService.getAllExpensesByUser(1L)).thenReturn(expenses);

        ResponseEntity<List<ExpenseDTO>> response = expenseController.getAllExpensesByUser(1L);

        assertEquals(expenses, response.getBody());
        verify(expenseService, times(1)).getAllExpensesByUser(1L);
    }

    @Test
    void getAllExpensesByCategory_success() {
        List<ExpenseDTO> expenses = List.of(new ExpenseDTO());
        when(expenseService.getExpensesByCategory(1L, "Food")).thenReturn(expenses);

        ResponseEntity<List<ExpenseDTO>> response = expenseController.getAllExpensesByCategory(1L, "Food");

        assertEquals(expenses, response.getBody());
        verify(expenseService, times(1)).getExpensesByCategory(1L, "Food");
    }

    @Test
    void getExpensesByDateRange_success() throws Exception {
        List<ExpenseDTO> expenses = List.of(new ExpenseDTO());
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date start = sdf.parse("01-01-2026");
        Date end = sdf.parse("31-01-2026");

        when(expenseService.getExpensesByDateRange(1L, start, end)).thenReturn(expenses);

        ResponseEntity<List<ExpenseDTO>> response = expenseController.getExpensesByDateRange(1L, start, end);

        assertEquals(expenses, response.getBody());
        verify(expenseService, times(1)).getExpensesByDateRange(1L, start, end);
    }

    @Test
    void deleteExpense_success() throws Exception {
        doNothing().when(expenseService).deleteExpense(1L);

        ResponseEntity<Void> response = expenseController.deleteExpense(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(expenseService, times(1)).deleteExpense(1L);
    }

    @Test
    void deleteExpense_notFound() throws Exception {
        doThrow(new Exception("Not found")).when(expenseService).deleteExpense(1L);

        ResponseEntity<Void> response = expenseController.deleteExpense(1L);

        assertEquals(404, response.getStatusCodeValue());
        verify(expenseService, times(1)).deleteExpense(1L);
    }

    @Test
    void uploadExpense_negativeAmount_throwsException() throws Exception {
        MultipartFile file = new MockMultipartFile("file", "expenses.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[]{});

        when(expenseService.uploadExcel(file, 1L))
                .thenThrow(new RuntimeException("Expense amount cannot be negative"));

        ResponseEntity<List<ExpenseDTO>> response = expenseController.uploadExpense(1L, file);

        assertEquals(400, response.getStatusCodeValue());
    }
    @Test
    void uploadExpense_emptyFile_returnsEmptyList() throws Exception {
        MultipartFile file = new MockMultipartFile("file", "empty.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[]{});

        when(expenseService.uploadExcel(file, 1L)).thenReturn(List.of());

        ResponseEntity<List<ExpenseDTO>> response = expenseController.uploadExpense(1L, file);

        assertTrue(response.getBody().isEmpty());
        verify(expenseService, times(1)).uploadExcel(file, 1L);
    }

    @Test
    void getExpensesByDateRange_invalidDates_throwsException() throws Exception {
        Date start = new Date();
        Date end = new Date(start.getTime() - 1000);

        when(expenseService.getExpensesByDateRange(1L, start, end))
                .thenThrow(new RuntimeException("Invalid date range"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> expenseController.getExpensesByDateRange(1L, start, end));
        assertEquals("Invalid date range", exception.getMessage());
    }


}
