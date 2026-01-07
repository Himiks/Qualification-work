import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeDashboard from "../modules/employee/components/EmployeeDashboard.jsx";
import employeeService from "../modules/employee/services/employeeService.js";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../modules/employee/services/employeeService.js");

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("EmployeeDashboard", () => {
  const tasks = [
    {
      id: 1,
      title: "Task One",
      description: "Description One",
      dueDate: "2026-01-01T00:00:00Z",
      priority: "HIGH",
      taskStatus: "PENDING",
      technique: "TECH1",
    },
    {
      id: 2,
      title: "Task Two",
      description: "Description Two",
      dueDate: "2026-01-02T00:00:00Z",
      priority: "LOW",
      taskStatus: "COMPLETED",
      technique: "NONE",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    employeeService.getAllTasksByUserId.mockResolvedValue(tasks);
    employeeService.deleteTask.mockResolvedValue({});
    employeeService.searchTask.mockImplementation((keyword) =>
      Promise.resolve(
        tasks.filter((t) => t.title.toLowerCase().includes(keyword.toLowerCase()))
      )
    );
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

  it("renders loading tasks initially and displays tasks", async () => {
    renderComponent();
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument(); 

    await waitFor(() => screen.getByText("Task One"));
    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("navigates to edit and details pages", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("Task One"));

    fireEvent.click(screen.getAllByTitle("View Details")[0]);
    expect(mockedNavigate).toHaveBeenCalledWith("/employee/task/1/details");

    fireEvent.click(screen.getAllByTitle("Edit Task")[0]);
    expect(mockedNavigate).toHaveBeenCalledWith("/employee/task/1/edit");
  });

  it("deletes a task after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderComponent();
    await waitFor(() => screen.getByText("Task One"));

    fireEvent.click(screen.getAllByTitle("Delete Task")[0]);

    await waitFor(() => {
      expect(screen.queryByText("Task One")).not.toBeInTheDocument();
      expect(screen.getByText("Task Two")).toBeInTheDocument();
    });

    window.confirm.mockRestore();
  });

  it("does not delete a task if confirm is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderComponent();
    await waitFor(() => screen.getByText("Task One"));

    fireEvent.click(screen.getAllByTitle("Delete Task")[0]);
    expect(employeeService.deleteTask).not.toHaveBeenCalled();

    window.confirm.mockRestore();
  });

  it("filters tasks using search", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("Task One"));

    const searchInput = screen.getByPlaceholderText(/Enter keyword to search/i);
    fireEvent.change(searchInput, { target: { value: "Two" } });

    await waitFor(() => {
      expect(screen.queryByText("Task One")).not.toBeInTheDocument();
      expect(screen.getByText("Task Two")).toBeInTheDocument();
    });
  });

  it("handles tasks with technique for Start button navigation", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("Task One"));

    const startButtons = screen.getAllByText("▶ Start");
    fireEvent.click(startButtons[0]);
    expect(mockedNavigate).toHaveBeenCalledWith("/techniques/tech1/1");

    fireEvent.click(startButtons[1]);
    expect(mockedNavigate).not.toHaveBeenCalledWith(expect.stringContaining("2"));
  });

  it("shows placeholder when no tasks exist", async () => {
    employeeService.getAllTasksByUserId.mockResolvedValueOnce([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });
});
