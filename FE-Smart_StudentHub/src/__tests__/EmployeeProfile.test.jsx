import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeProfile from "../modules/employee/components/EmployeeProfile.jsx";
import storageService from "../auth/services/storageService.js";
import employeeService from "../modules/employee/services/employeeService.js";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";

vi.mock("../auth/services/storageService.js", () => ({
  default: {
    getUser: vi.fn(),
    saveUser: vi.fn(),
  },
}));

vi.mock("../modules/employee/services/employeeService.js", () => ({
  default: {
    updateProfile: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("EmployeeProfile", () => {
  const mockUser = { name: "John Doe", email: "john@example.com" };

  beforeEach(() => {
    vi.clearAllMocks();
    storageService.getUser.mockReturnValue(mockUser);
    employeeService.updateProfile.mockResolvedValue({});
  });

  it("renders form inputs with user data", () => {
    render(
      <MemoryRouter initialEntries={["/employee/profile"]}>
        <Routes>
          <Route path="/employee/profile" element={<EmployeeProfile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Name/i)).toHaveValue(mockUser.name);
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(mockUser.email);
    expect(screen.getByPlaceholderText(/New Password/i)).toHaveValue("");
  });

  it("updates form state on input change", () => {
    render(
      <MemoryRouter initialEntries={["/employee/profile"]}>
        <Routes>
          <Route path="/employee/profile" element={<EmployeeProfile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: "newpass" } });

    expect(screen.getByPlaceholderText(/Name/i)).toHaveValue("Jane Doe");
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue("jane@example.com");
    expect(screen.getByPlaceholderText(/New Password/i)).toHaveValue("newpass");
  });

  it("saves changes successfully and shows toast", async () => {
    render(
      <MemoryRouter initialEntries={["/employee/profile"]}>
        <Routes>
          <Route path="/employee/profile" element={<EmployeeProfile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(employeeService.updateProfile).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: "",
      });
      expect(storageService.saveUser).toHaveBeenCalledWith({
        ...mockUser,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(toast.success).toHaveBeenCalledWith("Profile updated successfully!");
    });
  });

  it("shows error toast if update fails", async () => {
    employeeService.updateProfile.mockRejectedValueOnce(new Error("Failed"));

    render(
      <MemoryRouter initialEntries={["/employee/profile"]}>
        <Routes>
          <Route path="/employee/profile" element={<EmployeeProfile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error: Failed");
    });
  });
});
