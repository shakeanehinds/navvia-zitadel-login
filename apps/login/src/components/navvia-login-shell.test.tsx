import { render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { NavviaLoginShell } from "./navvia-login-shell";

afterEach(() => {
  vi.useRealTimers();
});

describe("NavviaLoginShell", () => {
  test("preserves the Navvia sign-in composition around route content", () => {
    render(
      <NavviaLoginShell>
        <button>Continue</button>
      </NavviaLoginShell>,
    );

    expect(screen.getByRole("link", { name: /skip to sign in/i })).toHaveAttribute("href", "#navvia-login-content");
    expect(screen.getByRole("main")).toHaveAttribute("data-theme", "light");
    expect(screen.getByText("NAVVIA")).toBeVisible();
    expect(screen.getByText("Connecting")).toBeVisible();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Protecting what matters to you.");
    expect(screen.getByRole("main")).toHaveTextContent("Continue");
  });

  test("settles from connecting to the invite-only status", () => {
    vi.useFakeTimers();
    render(<NavviaLoginShell>Sign in</NavviaLoginShell>);

    act(() => vi.advanceTimersByTime(1_300));

    expect(screen.getByText("Invite-only beta")).toBeVisible();
  });
});
