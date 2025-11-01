package com.example.Smart_StudentHub.services.expense;

import com.example.Smart_StudentHub.dto.ExpenseDTO;
import com.example.Smart_StudentHub.entities.Expense;
import com.example.Smart_StudentHub.entities.User;
import com.example.Smart_StudentHub.repositories.ExpenseRepository;
import com.example.Smart_StudentHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;


    @Override
    public List<ExpenseDTO> uploadExcel(MultipartFile file, Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        List<ExpenseDTO> expenseDTOList = new ArrayList<>();
        DataFormatter dataFormatter = new DataFormatter();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) return expenseDTOList;

            for (Row row : sheet) {
                if (row == null || row.getRowNum() == 0) continue;
                if (isRowEmpty(row)) continue;


                Date date = null;
                Cell dateCell = row.getCell(0);
                if (dateCell != null) {
                    if (dateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dateCell)) {
                        date = dateCell.getDateCellValue();
                    } else {
                        String dateStr = dataFormatter.formatCellValue(dateCell).trim();
                        if (!dateStr.isEmpty()) {
                            date = parseDateString(dateStr);
                        }
                    }
                }


                String category = getCellString(row.getCell(1), dataFormatter);
                String description = getCellString(row.getCell(2), dataFormatter);

                Double amount = 0.0;
                Cell amountCell = row.getCell(3);
                if (amountCell != null) {
                    if (amountCell.getCellType() == CellType.NUMERIC) {
                        amount = amountCell.getNumericCellValue();
                    } else {
                        String amtStr = dataFormatter.formatCellValue(amountCell).trim();
                        amount = parseDoubleLenient(amtStr);
                    }
                }

                boolean exists = expenseRepository
                        .findByUserIdAndDateAndCategoryAndDescriptionAndAmount(
                                userId, date, category, description, amount
                        )
                        .isPresent();

                if (exists) {
                    System.out.println("Duplicate found — skipping row: " + description);
                    continue;
                }


                Expense expense = new Expense();
                expense.setDate(date);
                expense.setCategory(category);
                expense.setDescription(description);
                expense.setAmount(amount);
                expense.setUser(user);

                expenseRepository.save(expense);
                expenseDTOList.add(expense.getExpenseDTO());
            }
        }

        return expenseDTOList;
    }


    private String getCellString(Cell cell, DataFormatter formatter) {
        if (cell == null) return "";
        return formatter.formatCellValue(cell).trim();
    }


    private Double parseDoubleLenient(String s) {
        if (s == null || s.isBlank()) return 0.0;

        String cleaned = s.replaceAll("[^0-9,\\.-]", "").replace(",", ".");
        if (cleaned.isBlank()) return 0.0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {

            return 0.0;
        }
    }


    private Date parseDateString(String dateStr) {
        String[] patterns = new String[] { "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };
        for (String p : patterns) {
            try {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern(p);
                LocalDate ld = LocalDate.parse(dateStr, fmt);
                return Date.from(ld.atStartOfDay(ZoneId.systemDefault()).toInstant());
            } catch (DateTimeParseException ignored) { }
        }

        try {
            double excelSerial = Double.parseDouble(dateStr);

            return DateUtil.getJavaDate(excelSerial);
        } catch (Exception ignored) { }

        return null;
    }


    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        DataFormatter f = new DataFormatter();
        for (int c = 0; c <= 3; c++) {
            Cell cell = row.getCell(c);
            if (cell != null && !f.formatCellValue(cell).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    @Override
    public List<ExpenseDTO> getAllExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .map(Expense::getExpenseDTO)
                .toList();
    }

    @Override
    public List<ExpenseDTO> getExpensesByCategory(Long userId, String category) {
        return expenseRepository.findAllByUserIdAndCategory(userId, category)
                .stream()
                .map(Expense::getExpenseDTO)
                .toList();
    }

    @Override
    public List<ExpenseDTO> getExpensesByDateRange(Long userId, Date start, Date end) {
        return expenseRepository.findAllByUserIdAndDateBetween(userId, start, end)
                .stream()
                .map(Expense::getExpenseDTO)
                .toList();
    }

    @Override
    public void deleteExpense(Long expenseId) throws Exception {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new Exception("Expense not found"));
        expenseRepository.delete(expense);
    }



}
