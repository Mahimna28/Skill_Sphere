import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import StudentSidebar from "../StudentSidebar";

// Mock next/navigation
const mockUsePathname = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ fill, ...props }: any) => <img {...props} data-fill={fill ? "true" : undefined} />,
}));

describe("StudentSidebar - Apple Glassmorphism & Community Hub Navigation", () => {
  beforeEach(() => {
    localStorage.clear();
    mockUsePathname.mockReturnValue("/dashboard/student");
    mockUseSearchParams.mockReturnValue({ get: () => null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders with visual class glass-sidebar on root", () => {
    render(<StudentSidebar onLogout={() => {}} />);
    const navRoot = screen.getByRole("navigation", { name: /main sidebar/i });
    expect(navRoot).toHaveClass("glass-sidebar");
    expect(navRoot).toHaveClass("sidebar-root");
  });

  it("renders collapsed by default on first load", () => {
    render(<StudentSidebar onLogout={() => {}} />);
    const toggleButton = screen.getByRole("button", { name: /community hub/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    const groupChildren = screen.getByRole("group", { hidden: true });
    expect(groupChildren).toHaveAttribute("aria-hidden", "true");
    expect(groupChildren).not.toHaveClass("open");

    const groupContainer = toggleButton.parentElement!;
    expect(groupContainer).toHaveClass("sidebar-group");
    expect(groupContainer).not.toHaveClass("open");
  });

  it("sidebar-group toggles open class on click", () => {
    render(<StudentSidebar onLogout={() => {}} />);
    const toggleButton = screen.getByRole("button", { name: /community hub/i });
    const groupContainer = toggleButton.parentElement!;

    // Click to open
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("group")).toHaveAttribute("aria-hidden", "false");
    expect(groupContainer).toHaveClass("open");

    // Click to close
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("group", { hidden: true })).toHaveAttribute("aria-hidden", "true");
    expect(groupContainer).not.toHaveClass("open");
  });

  it("toggles open and closed on Enter and Space keys", () => {
    render(<StudentSidebar onLogout={() => {}} />);
    const toggleButton = screen.getByRole("button", { name: /community hub/i });
    const groupContainer = toggleButton.parentElement!;

    // Press Enter to open
    fireEvent.keyDown(toggleButton, { key: "Enter" });
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(groupContainer).toHaveClass("open");

    // Press Space to close
    fireEvent.keyDown(toggleButton, { key: " " });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(groupContainer).not.toHaveClass("open");
  });

  it("persists collapse state in localStorage key sidebar_community_hub_open", () => {
    render(<StudentSidebar onLogout={() => {}} />);
    const toggleButton = screen.getByRole("button", { name: /community hub/i });

    // Initially not set or false
    expect(localStorage.getItem("sidebar_community_hub_open")).toBe("false");

    // Click to open
    fireEvent.click(toggleButton);
    expect(localStorage.getItem("sidebar_community_hub_open")).toBe("true");

    // Click to close
    fireEvent.click(toggleButton);
    expect(localStorage.getItem("sidebar_community_hub_open")).toBe("false");
  });

  it("sidebar-group has active and open classes when router.pathname matches a child route", () => {
    mockUsePathname.mockReturnValue("/dashboard/student/chat");
    render(<StudentSidebar onLogout={() => {}} />);

    const toggleButton = screen.getByRole("button", { name: /community hub/i });
    const groupContainer = toggleButton.parentElement!;

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(groupContainer).toHaveClass("open");
    expect(groupContainer).toHaveClass("active");

    const groupChildren = screen.getByRole("group");
    expect(groupChildren).toHaveAttribute("aria-hidden", "false");
  });

  it("sets correct aria-current='page' and active styles on active child link", () => {
    mockUsePathname.mockReturnValue("/dashboard/qa");
    render(<StudentSidebar onLogout={() => {}} />);

    const chatLink = screen.getByRole("link", { name: /^chat$/i });
    const forumLink = screen.getByRole("link", { name: /^forum$/i });
    const messagesLink = screen.getByRole("link", { name: /^messages$/i });

    expect(chatLink).not.toHaveAttribute("aria-current");
    expect(chatLink).not.toHaveClass("active");

    expect(forumLink).toHaveAttribute("aria-current", "page");
    expect(forumLink).toHaveClass("active");

    expect(messagesLink).not.toHaveAttribute("aria-current");
    expect(messagesLink).not.toHaveClass("active");
  });
});
