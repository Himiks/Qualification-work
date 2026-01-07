import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "../modules/admin/components/AdminDashboard.jsx";
import adminService from "../modules/admin/services/adminService.js";
import storageService from "../auth/services/storageService.js";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";

vi.mock("../modules/admin/services/adminService.js");
vi.mock("../auth/services/storageService.js");

const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    dueDate: new Date().toISOString(),
    employeeName: "John Doe",
    priority: "HIGH",
    taskStatus: "IN_PROGRESS",
    technique: "NONE",
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    dueDate: new Date().toISOString(),
    employeeName: "Jane Doe",
    priority: "LOW",
    taskStatus: "COMPLETED",
    technique: "TECH1",
  },
];

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders access denied for non-admin users", () => {
    storageService.getUserRole.mockReturnValue("EMPLOYEE");

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    expect(screen.getByText(/You do not have permission/i)).toBeInTheDocument();
  });

  it("renders tasks for admin users", async () => {
    storageService.getUserRole.mockReturnValue("ADMIN");
    adminService.getTasks.mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => expect(adminService.getTasks).toHaveBeenCalled());

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("calls deleteTask when delete button is clicked", async () => {
    storageService.getUserRole.mockReturnValue("ADMIN");
    adminService.getTasks.mockResolvedValue(mockTasks);
    adminService.deleteTask.mockResolvedValue();

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Task 1"));

    vi.spyOn(window, "confirm").mockReturnValue(true);

    const deleteButtons = screen.getAllByTitle("Delete Task");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(adminService.deleteTask).toHaveBeenCalledWith(1));
  });

  it("updates search input and calls searchTask", async () => {
    storageService.getUserRole.mockReturnValue("ADMIN");
    adminService.getTasks.mockResolvedValue(mockTasks);
    adminService.searchTask.mockResolvedValue([mockTasks[1]]);

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Task 1"));

    const input = screen.getByPlaceholderText(/Enter keyword to search/i);
    fireEvent.change(input, { target: { value: "Task 2" } });

    await waitFor(() => expect(adminService.searchTask).toHaveBeenCalledWith("Task 2"));
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });
});
