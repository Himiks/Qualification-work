import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeePostTask from "../modules/employee/components/EmployeePostTask.jsx";
import employeeService from "../modules/employee/services/employeeService.js";
import { getAllTechniques } from "../modules/technique/services/techniqueService.js";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";

vi.mock("../modules/employee/services/employeeService.js");
vi.mock("../modules/technique/services/techniqueService.js");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("EmployeePostTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllTechniques.mockResolvedValue([
      { id: "t1", name: "Technique 1" },
      { id: "t2", name: "Technique 2" },
    ]);
    employeeService.postTask.mockResolvedValue({});
  });

  it("renders form inputs correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/employee/post-task"]}>
        <Routes>
          <Route path="/employee/post-task" element={<EmployeePostTask />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter task description/i)).toBeInTheDocument();
    expect(document.querySelector('input[name="dueDate"]')).toBeInTheDocument();
    expect(document.querySelector('select[name="priority"]')).toBeInTheDocument();
    expect(document.querySelector('select[name="technique"]')).toBeInTheDocument();

    await waitFor(() => expect(getAllTechniques).toHaveBeenCalled());
  });

  it("updates form fields on change", async () => {
    render(
      <MemoryRouter initialEntries={["/employee/post-task"]}>
        <Routes>
          <Route path="/employee/post-task" element={<EmployeePostTask />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter task title/i), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter task description/i), { target: { value: "Task Description" } });

    const dueDateInput = document.querySelector('input[name="dueDate"]');
    fireEvent.change(dueDateInput, { target: { value: "2026-01-01" } });

    const prioritySelect = document.querySelector('select[name="priority"]');
    fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

    const techniqueSelect = document.querySelector('select[name="technique"]');
    fireEvent.change(techniqueSelect, { target: { value: "Technique 2" } });

    expect(screen.getByPlaceholderText(/Enter task title/i)).toHaveValue("New Task");
    expect(screen.getByPlaceholderText(/Enter task description/i)).toHaveValue("Task Description");
    expect(dueDateInput).toHaveValue("2026-01-01");
    expect(prioritySelect).toHaveValue("HIGH");
    expect(techniqueSelect).toHaveValue("Technique 2");
  });

  it("submits the form and shows success toast", async () => {
    render(
      <MemoryRouter initialEntries={["/employee/post-task"]}>
        <Routes>
          <Route path="/employee/post-task" element={<EmployeePostTask />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter task title/i), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter task description/i), { target: { value: "Task Description" } });

    const dueDateInput = document.querySelector('input[name="dueDate"]');
    fireEvent.change(dueDateInput, { target: { value: "2026-01-01" } });

    const prioritySelect = document.querySelector('select[name="priority"]');
    fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

    const techniqueSelect = document.querySelector('select[name="technique"]');
    fireEvent.change(techniqueSelect, { target: { value: "Technique 2" } });

    fireEvent.submit(screen.getByText(/Post Task/i));

    await waitFor(() => {
      expect(employeeService.postTask).toHaveBeenCalledWith({
        title: "New Task",
        description: "Task Description",
        dueDate: "2026-01-01",
        priority: "HIGH",
        technique: "Technique 2",
      });
      expect(toast.success).toHaveBeenCalledWith("Task created successfully!");
    });
  });

  it("shows error toast if submission fails", async () => {
    employeeService.postTask.mockRejectedValueOnce(new Error("Failed"));

    render(
      <MemoryRouter initialEntries={["/employee/post-task"]}>
        <Routes>
          <Route path="/employee/post-task" element={<EmployeePostTask />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.submit(screen.getByText(/Post Task/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to post task");
    });
  });
});
