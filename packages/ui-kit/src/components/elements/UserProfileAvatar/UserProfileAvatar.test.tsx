import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/fixtures/users.fixtures";
import { UserProfileAvatar } from "./UserProfileAvatar";

const userNoAvatar = { ...participantsMock.u1, avatar_url: undefined, avatar_object: undefined };

const defaultProps: ComponentProps<typeof UserProfileAvatar> = {
  user: userNoAvatar,
};

const renderComponent = (props: Partial<ComponentProps<typeof UserProfileAvatar>> = {}) =>
  render(<UserProfileAvatar {...defaultProps} {...props} />);

describe("UserProfileAvatar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render the user placeholder icon when no avatar image is set", () => {
      renderComponent();
      expect(screen.getByTestId("icon-user")).toBeInTheDocument();
    });

    it("should apply accent swap styling on the inner shell when requested", () => {
      const { container } = renderComponent({ user: participantsMock.u1, swapAccentAndMainColor: true });
      const accentShell = [...container.querySelectorAll("div")].find((el) =>
        el.className.includes("ui:bg-accent-100"),
      );
      expect(accentShell).toBeTruthy();
    });
  });

  describe("props", () => {
    it("should merge className onto the root", () => {
      const { container } = renderComponent({ user: participantsMock.u1, className: "ui:opacity-80" });
      expect(container.firstElementChild).toHaveClass("ui:opacity-80");
    });
  });

  describe("user interaction", () => {
    it("should expose a hidden file input and a camera trigger", async () => {
      renderComponent({ user: participantsMock.u1 });
      const fileInput = document.querySelector("#inputFile") as HTMLInputElement | null;
      expect(fileInput?.type).toBe("file");
      await user.click(screen.getByTestId("icon-camera"));
    });
  });
});
