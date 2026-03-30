// FILE: web/src/test/smoke-ui.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "../components/PageLoader";
import ReportsPage from "../pages/ReportsPage";

describe("smoke ui", () => {
  it("PageLoader render edilir", () => {
    const { container } = render(<PageLoader />);
    expect(container).toBeInTheDocument();
  });

  it("ReportsPage render edilir", () => {
    render(<ReportsPage />);
    expect(
      screen.getByRole("heading", { name: /raporlar/i })
    ).toBeInTheDocument();
  });
});
