import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUpdateTask from "../modules/admin/components/AdminUpdateTask.jsx";
import adminService from "../modules/admin/services/adminService.js";
import { getAllTechniques } from "../modules/technique/services/techniqueService.js";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";
import storageService from "../auth/services/storageService.js";
vi.mock("../modules/admin/services/adminService.js");
vi.mock("../modules/technique/services/techniqueService.js");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AdminUpdateTask", () => {
  const taskData = {
    employeeId: 1,
    title: "Initial Task",
    description: "Initial Description",
    dueDate: "2026-01-01T00:00:00Z",
    priority: "LOW",
    taskStatus: "PENDING",
    technique: "NONE",
  };

  const usersData = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ];

  const techniquesData = [
    { id: 1, name: "Pomodoro" },
    { id: 2, name: "Eisenhower" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure admin access for the component
    vi.spyOn(storageService, "isAdminLoggedIn").mockReturnValue(true);
    vi.spyOn(storageService, "getUser").mockReturnValue({ id: "1", role: "ADMIN" });

    adminService.getTaskById.mockResolvedValue(taskData);
    adminService.getUsers.mockResolvedValue(usersData);
    getAllTechniques.mockResolvedValue(techniquesData);
    adminService.updateTask.mockResolvedValue({});
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/admin/update-task/1"]}>
        <Routes>
          <Route path="/admin/update-task/:id" element={<AdminUpdateTask />} />
        </Routes>
      </MemoryRouter>
    );

  it("renders form inputs correctly with fetched data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Initial Task/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Initial Description/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("2026-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("LOW")).toBeInTheDocument();
      expect(screen.getByDisplayValue("PENDING")).toBeInTheDocument();
      expect(screen.getByDisplayValue("None")).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it("updates form fields on change", async () => {
    renderComponent();

    await waitFor(() => screen.getByDisplayValue(/Initial Task/i));

    fireEvent.change(screen.getByDisplayValue(/Initial Task/i), { target: { value: "Updated Task" } });
    fireEvent.change(screen.getByDisplayValue(/Initial Description/i), { target: { value: "Updated Description" } });
    fireEvent.change(screen.getByDisplayValue("LOW"), { target: { value: "HIGH" } });
    fireEvent.change(screen.getByDisplayValue("None"), { target: { value: "Pomodoro" } });
    fireEvent.change(screen.getByDisplayValue("PENDING"), { target: { value: "IN_PROGRESS" } });

    expect(screen.getByDisplayValue("Updated Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Updated Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("HIGH")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pomodoro")).toBeInTheDocument();
    expect(screen.getByDisplayValue("IN_PROGRESS")).toBeInTheDocument();
  });

  it("submits the form and shows success toast", async () => {
    renderComponent();

    await waitFor(() => screen.getByDisplayValue(/Initial Task/i));

    fireEvent.change(screen.getByDisplayValue(/Initial Task/i), { target: { value: "Updated Task" } });
    fireEvent.submit(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(adminService.updateTask).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ title: "Updated Task" })
      );
      expect(toast.success).toHaveBeenCalledWith("Task updated successfully!");
    });
  });

  it("shows error toast if submission fails", async () => {
    adminService.updateTask.mockRejectedValueOnce(new Error("Failed"));

    renderComponent();

    await waitFor(() => screen.getByDisplayValue(/Initial Task/i));
    fireEvent.submit(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update task!");
    });
  });
});
