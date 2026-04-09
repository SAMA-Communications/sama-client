export interface ResetPasswordFormData {
  email?: string;
  token?: string;
  new_password?: string;
}

/** OTP + new password steps; booleans from async handlers drive navigation. */
export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Send OTP to email. Return true to advance to step 2. */
  onSendOTP: (email: string) => Promise<boolean>;
  /** Reset password with token. Return true to close modal. */
  onResetPassword: (data: ResetPasswordFormData) => Promise<boolean>;
  /** Resend OTP. Called when user clicks Resend. */
  onResendOTP: (email: string) => Promise<void>;
  /** Optional: show validation error (e.g. alert). */
  onValidationError?: (message: string) => void;
}
