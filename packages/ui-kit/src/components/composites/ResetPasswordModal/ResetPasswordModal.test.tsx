import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ResetPasswordModal } from "./ResetPasswordModal";

const baseCallbacks = {
  onClose: vi.fn(),
  onSendOTP: vi.fn(),
  onResetPassword: vi.fn(),
  onResendOTP: vi.fn(),
};

const defaultProps: ComponentProps<typeof ResetPasswordModal> = {
  isOpen: true,
  ...baseCallbacks,
};

const renderComponent = (props: Partial<ComponentProps<typeof ResetPasswordModal>> = {}) =>
  render(<ResetPasswordModal {...defaultProps} {...props} />);

describe("ResetPasswordModal", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    localStorage.clear();
  });

  describe("rendering", () => {
    it("should render nothing when isOpen is false", () => {
      const { container } = renderComponent({ isOpen: false });
      expect(container.firstChild).toBeNull();
    });

    it("should show step 1 copy and email field when open", () => {
      renderComponent();
      expect(screen.getByText("Reset Password")).toBeVisible();
      expect(screen.getByPlaceholderText("Enter your email")).toBeVisible();
    });

    it("should jump to step 2 when reset_email is primed in localStorage", () => {
      localStorage.setItem("reset_email", "saved@example.com");
      renderComponent();
      expect(screen.getByText(/verification code to/i)).toBeVisible();
      expect(screen.getByText("saved@example.com")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onSendOTP and advance to step 2 on success", async () => {
      const onSendOTP = vi.fn().mockResolvedValue(true);
      renderComponent({ onSendOTP });
      await user.type(screen.getByPlaceholderText("Enter your email"), "a@b.com");
      await user.click(screen.getByRole("button", { name: "Confirm" }));
      expect(onSendOTP).toHaveBeenCalledWith("a@b.com");
      expect(screen.getByPlaceholderText(/6 digit OTP/i)).toBeVisible();
    });

    it("should call onResetPassword when step 2 is submitted", async () => {
      const onResetPassword = vi.fn().mockResolvedValue(true);
      const onClose = vi.fn();
      localStorage.setItem("reset_email", "u@x.com");
      renderComponent({ onResetPassword, onClose });
      await user.type(screen.getByPlaceholderText(/6 digit OTP/i), "123456");
      await user.type(screen.getByPlaceholderText(/new password/i), "secret99");
      await user.click(screen.getByRole("button", { name: "Confirm" }));
      expect(onResetPassword).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "u@x.com",
          token: "123456",
          new_password: "secret99",
        }),
      );
    });

    it("should call onClose from the cancel control", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should keep send disabled until an email is entered", () => {
      const onSendOTP = vi.fn();
      renderComponent({ onSendOTP });
      expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
      expect(onSendOTP).not.toHaveBeenCalled();
    });
  });
});
