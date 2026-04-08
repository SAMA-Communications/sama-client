import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/participants.mock";
import { ConfirmWindowProvider } from "@src/hooks/useConfirmWindow";
import { getAdapters } from "@adapters";
import { UserProfile } from "./UserProfile";

const defaultProps: ComponentProps<typeof UserProfile> = {
  user: participantsMock.u1,
  onLogout: vi.fn(),
  onClose: vi.fn(),
  onEditProfile: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof UserProfile>> = {}) =>
  render(
    <ConfirmWindowProvider>
      <UserProfile {...defaultProps} {...props} />
    </ConfirmWindowProvider>,
  );

describe("UserProfile", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    window.prompt = vi.fn(() => null) as unknown as typeof window.prompt;
  });

  describe("rendering", () => {
    it("should show personal blocks and username from the user model", () => {
      renderComponent();
      expect(screen.getByText("Personal information")).toBeVisible();
      expect(screen.getByText("UserTest1")).toBeVisible();
      expect(screen.getByText("Settings")).toBeVisible();
      expect(screen.getByText("Change password")).toBeVisible();
      expect(screen.getByRole("button", { name: /Log out/i })).toBeInTheDocument();
    });

    it("should show placeholder heading when first and last name are missing", () => {
      renderComponent({
        user: { ...participantsMock.u1, first_name: "", last_name: "" },
      });
      expect(screen.getByText("First & Last Name")).toBeVisible();
    });

    it("should hide password and delete actions for sama-user- logins", () => {
      renderComponent({
        user: { ...participantsMock.u1, login: "sama-user-demo" },
      });
      expect(screen.queryByText("Change password")).not.toBeInTheDocument();
      expect(screen.queryByText("Delete account")).not.toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onClose when the back control is used", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      const back = screen.getByTestId("icon-chevron-left").closest("button");
      expect(back).toBeTruthy();
      await user.click(back!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onEditProfile from the accent link and editable phone/email rows", async () => {
      const onEditProfile = vi.fn();
      renderComponent({ onEditProfile });
      await user.click(screen.getByText("Edit User Info"));
      expect(onEditProfile).toHaveBeenCalled();
      await user.click(screen.getByText("Phone number"));
      expect(onEditProfile).toHaveBeenCalledTimes(2);
    });

    it("should call onLogout and onNavigateToAuth when logging out", async () => {
      const onLogout = vi.fn();
      const onNavigateToAuth = vi.fn();
      renderComponent({ onLogout, onNavigateToAuth });
      await user.click(screen.getByRole("button", { name: /Log out/i }));
      expect(onNavigateToAuth).toHaveBeenCalledTimes(1);
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("should call updateCurrentUserPassword when prompts return values", async () => {
      const updateCurrentUserPassword = getAdapters().useParticipants().updateCurrentUserPassword as ReturnType<
        typeof vi.fn
      >;
      window.prompt = vi
        .fn()
        .mockReturnValueOnce("old-pass")
        .mockReturnValueOnce("new-pass") as unknown as typeof window.prompt;

      renderComponent();
      await user.click(screen.getByText("Change password"));
      expect(updateCurrentUserPassword).toHaveBeenCalledWith("old-pass", "new-pass");
    });

    it("should open confirm dialog and call deleteCurrentUser when deleting account is confirmed", async () => {
      const deleteCurrentUser = getAdapters().useParticipants().deleteCurrentUser as ReturnType<typeof vi.fn>;
      deleteCurrentUser.mockResolvedValueOnce(true);
      const onNavigateToAuth = vi.fn();

      renderComponent({ onNavigateToAuth });
      await user.click(screen.getByText("Delete account"));

      expect(await screen.findByText("Delete User")).toBeVisible();
      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(deleteCurrentUser).toHaveBeenCalledTimes(1);
      expect(onNavigateToAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should render when onNavigateToAuth is omitted", () => {
      expect(() => renderComponent({ onNavigateToAuth: undefined })).not.toThrow();
      expect(screen.getByText("Personal information")).toBeVisible();
    });
  });
});
