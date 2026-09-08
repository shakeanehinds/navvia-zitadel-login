import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DynamicTheme } from "./dynamic-theme";

vi.mock("./theme-wrapper", () => ({
  ThemeWrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("DynamicTheme", () => {
  it("renders route content in the Navvia form layout without legacy branding chrome", () => {
    const { container } = render(
      <DynamicTheme>
        <div>Identity</div>
        <form aria-label="Credentials" />
      </DynamicTheme>,
    );

    expect(screen.getByText("Identity")).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Credentials" })).toBeInTheDocument();
    expect(container.querySelector(".navvia-auth-flow")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("keeps render-function routes in the single-column Navvia layout", () => {
    render(<DynamicTheme>{(isSideBySide) => <span>{String(isSideBySide)}</span>}</DynamicTheme>);

    expect(screen.getByText("false")).toBeInTheDocument();
  });
});
