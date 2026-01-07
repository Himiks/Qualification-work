import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminEditUser from "../modules/admin/components/AdminEditUser.jsx";
import adminService from "../modules/admin/services/adminService.js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";
import storageService from "../auth/services/storageService.js";


vi.mock("../modules/admin/services/adminService.js");
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AdminEditUser", () => {
  const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };

  beforeEach(() => {
    vi.clearAllMocks();
    adminService.getUserById.mockResolvedValue(mockUser);
    adminService.updateUser.mockResolvedValue({});
    vi.spyOn(storageService, "getUserRole").mockReturnValue("ADMIN");
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/admin/user/1/edit"]}>
        <Routes>
          <Route path="/admin/user/:id/edit" element={<AdminEditUser />} />
        </Routes>
      </MemoryRouter>
    );

  it("renders form with fetched user data", async () => {
    renderComponent();

    await waitFor(() => expect(adminService.getUserById).toHaveBeenCalledWith("1"));

    expect(screen.getByPlaceholderText("Name")).toHaveValue("John Doe");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("john@example.com");
    expect(screen.getByPlaceholderText("New Password (optional)")).toHaveValue("");
  });

  it("updates form values on input change", async () => {
    renderComponent();

    await waitFor(() => screen.getByPlaceholderText("Name"));

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("New Password (optional)"), { target: { value: "123456" } });

    expect(screen.getByPlaceholderText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByPlaceholderText("New Password (optional)")).toHaveValue("123456");
  });

  it("calls updateUser and shows success toast on save", async () => {
    renderComponent();

    await waitFor(() => screen.getByPlaceholderText("Name"));

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(adminService.updateUser).toHaveBeenCalledWith("1", {
        name: "Jane Doe",
        email: "john@example.com",
        password: "",
      });
      expect(toast.success).toHaveBeenCalledWith("User updated successfully!");
    });
  });

  it("shows error toast if updateUser fails", async () => {
    adminService.updateUser.mockRejectedValueOnce(new Error("Failed"));

    renderComponent();

    await waitFor(() => screen.getByPlaceholderText("Name"));

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update user");
    });
  });
});
