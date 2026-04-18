import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ProjectsTab } from "../components/ProjectsTab";

vi.mock("../components/ProjectCreateModal", () => ({
  ProjectCreateModal: () => <div>Project Create Modal Mock</div>,
}));

vi.mock("../services/project.service", () => ({
  getProjects: vi.fn().mockResolvedValue([
    { id: 1, name: "HQ Project", code: "HQ-1", is_active: true, company_id: 1, project_type: "merkez" },
  ]),
  deleteProject: vi.fn().mockResolvedValue({ message: "ok" }),
}));

vi.mock("../services/admin.service", async () => {
  const actual = await vi.importActual<typeof import("../services/admin.service")>("../services/admin.service");
  return {
    ...actual,
    getCompanies: vi.fn().mockResolvedValue([
      { id: 1, name: "ACME", color: "#2563eb", is_active: true, created_at: "", updated_at: "" },
    ]),
  };
});

describe("ProjectsTab permissions", () => {
  it("readOnly modda yazma aksiyonlarini kapatir", async () => {
    render(
      <MemoryRouter>
        <ProjectsTab readOnly />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/platform personeli proje portfoyunu inceleyebilir/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yeni proje/i })).toBeDisabled();
    expect(screen.getByRole("link", { name: /detaylar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /🗑️/i })).toBeDisabled();
  });
});