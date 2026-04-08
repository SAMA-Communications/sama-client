import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ProgrammableEditorDocsBanner } from "./ProgrammableEditorDocsBanner";

const defaultProps: ComponentProps<typeof ProgrammableEditorDocsBanner> = {
  href: "https://docs.example.com",
  label: "API docs",
};

const renderComponent = (props: Partial<ComponentProps<typeof ProgrammableEditorDocsBanner>> = {}) =>
  render(<ProgrammableEditorDocsBanner {...defaultProps} {...props} />);

describe("ProgrammableEditorDocsBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render an external documentation link with safe rel/target", () => {
      renderComponent();
      const link = screen.getByRole("link", { name: "API docs" });
      expect(link).toHaveAttribute("href", "https://docs.example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should use the default link label when label is omitted", () => {
      renderComponent({ href: "https://docs.example.com", label: undefined });
      expect(screen.getByRole("link", { name: "documentation" })).toHaveAttribute(
        "href",
        "https://docs.example.com",
      );
    });
  });
});
