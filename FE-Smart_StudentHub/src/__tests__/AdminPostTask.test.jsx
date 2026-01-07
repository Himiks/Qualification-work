import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPostTask from "../modules/admin/components/AdminPostTask.jsx";
import adminService from "../modules/admin/services/adminService.js";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";
import storageService from "../auth/services/storageService.js";

vi.mock("../modules/admin/services/adminService.js");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AdminPostTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(storageService, "isAdminLoggedIn").mockReturnValue(true);
    vi.spyOn(storageService, "getUser").mockReturnValue({ id: "1", role: "ADMIN" });

    adminService.getUsers.mockResolvedValue([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ]);
    adminService.postTask.mockResolvedValue({});
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/admin/post-task"]}>
        <Routes>
          <Route path="/admin/post-task" element={<AdminPostTask />} />
        </Routes>
      </MemoryRouter>
    );

  it("renders form inputs correctly", async () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/Enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter task description/i)).toBeInTheDocument();
    expect(document.querySelector('select[name="priority"]')).toBeInTheDocument();
    expect(document.querySelector('select[name="technique"]')).toBeInTheDocument();

    await waitFor(() => expect(adminService.getUsers).toHaveBeenCalled());
  });

  it("updates form fields on change", async () => {
    renderComponent();

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter task title/i), { target: { value: "Test Task" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter task description/i), { target: { value: "Test Description" } });

    const prioritySelect = document.querySelector('select[name="priority"]');
    fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

    const techniqueSelect = document.querySelector('select[name="technique"]');
    fireEvent.change(techniqueSelect, { target: { value: "POMODORO" } });

    expect(screen.getByPlaceholderText(/Enter task title/i)).toHaveValue("Test Task");
    expect(screen.getByPlaceholderText(/Enter task description/i)).toHaveValue("Test Description");
    expect(prioritySelect).toHaveValue("HIGH");
    expect(techniqueSelect).toHaveValue("POMODORO");
  });

  it("submits the form and shows success toast", async () => {
    renderComponent();

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter task title/i), { target: { value: "Test Task" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter task description/i), { target: { value: "Test Description" } });

    const prioritySelect = document.querySelector('select[name="priority"]');
    fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

    const techniqueSelect = document.querySelector('select[name="technique"]');
    fireEvent.change(techniqueSelect, { target: { value: "POMODORO" } });

    fireEvent.submit(screen.getByText(/Create Task/i));

    await waitFor(() => {
      expect(adminService.postTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        dueDate: "",
        priority: "HIGH",
        technique: "POMODORO",
      });
      expect(toast.success).toHaveBeenCalledWith("Task created successfully!");
    });
  });

  it("shows error toast if submission fails", async () => {
    adminService.postTask.mockRejectedValueOnce(new Error("Failed"));

    renderComponent();

    await waitFor(() => screen.getByPlaceholderText(/Enter task title/i));

    fireEvent.submit(screen.getByText(/Create Task/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to post task");
    });
  });
});
