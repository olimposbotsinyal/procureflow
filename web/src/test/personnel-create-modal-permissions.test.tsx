import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PersonnelCreateModal } from "../components/PersonnelCreateModal";

const mockUseAuth = vi.fn();

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../services/admin.service", () => ({
  getDepartments: vi.fn().mockResolvedValue([]),
  getCompanies: vi.fn().mockResolvedValue([]),
  getRoles: vi.fn().mockResolvedValue([]),
  addUserCompanyAssignment: vi.fn(),
  updateUserCompanyAssignment: vi.fn(),
  removeUserCompanyAssignment: vi.fn(),
}));

describe("PersonnelCreateModal permissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tenant admin icin privileged rol seceneklerini gizler", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 10,
        email: "tenant-admin@test.com",
        role: "admin",
        system_role: "tenant_admin",
      },
    });

    render(
      <PersonnelCreateModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByText(/operasyonel rol/i)).toBeInTheDocument());

    const roleSelect = screen.getAllByRole("combobox")[0];
    expect(screen.queryByRole("option", { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /süper admin/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/sistem rolü/i)).not.toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
  });

  it("super admin icin privileged rol ve sistem rolu secimini gosterir", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: "super@test.com",
        role: "super_admin",
        system_role: "super_admin",
      },
    });

    render(
      <PersonnelCreateModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
    );

    await screen.findByText(/operasyonel rol/i);
    const roleSelect = screen.getAllByRole("combobox")[0];
    expect(screen.getByRole("option", { name: /^admin$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /süper admin/i })).toBeInTheDocument();

    await user.selectOptions(roleSelect, "admin");

    expect(await screen.findByText(/sistem rolü/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /tenant admin/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /platform destek/i })).toBeInTheDocument();
  });
});
