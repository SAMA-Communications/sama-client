import { useState, useEffect, useCallback } from "react";

import { clsx } from "clsx";

import {
  ResetPasswordModalProps,
  ResetPasswordFormData,
} from "@composites/ResetPasswordModal/ResetPasswordModal.types";

import { WrapperRoot } from "@elements/WrapperRoot";

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  onSendOTP,
  onResetPassword,
  onResendOTP,
  onValidationError,
}: ResetPasswordModalProps) => {
  const [data, setData] = useState<ResetPasswordFormData>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((r) => r - 1), 1000);
    }
    return () => (timer ? clearTimeout(timer) : undefined);
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen) {
      const savedEmail = typeof localStorage !== "undefined" ? localStorage.getItem("reset_email") : null;
      if (savedEmail) {
        setData({ email: savedEmail });
        setStep(2);
      } else {
        setStep(1);
        setData({});
      }
      setLoading(false);
    }
  }, [isOpen]);

  const handleSendOTP = useCallback(async () => {
    const email = data.email?.trim();
    if (!email?.length) {
      onValidationError?.("No email to resend token.");
      return;
    }
    setLoading(true);
    const success = await onSendOTP(email);
    if (success) setStep(2);
    setLoading(false);
  }, [data.email, onSendOTP, onValidationError]);

  const handleResetPassword = useCallback(async () => {
    if (!data.email || !data.token?.length || !data.new_password?.length) {
      onValidationError?.("Please fill all fields.");
      return;
    }
    setLoading(true);
    const success = await onResetPassword(data);
    if (success) handleClose();
    setLoading(false);
  }, [data, onResetPassword, onValidationError]);

  const handleResendOTP = useCallback(async () => {
    const email = data.email?.trim();
    if (!email?.length) {
      onValidationError?.("No email to resend token.");
      return;
    }
    setLoading(true);
    await onResendOTP(email);
    setResendTimer(90);
    setLoading(false);
  }, [data.email, onResendOTP, onValidationError]);

  const handleClose = useCallback(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("reset_email");
    }
    onClose();
  }, [onClose]);

  const updateData = useCallback((field: keyof ResetPasswordFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (!isOpen) return null;

  return (
    <WrapperRoot className="ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center ui:bg-black/50">
      <div className="ui:flex ui:max-h-[80svh] ui:w-[min(460px,100%)] ui:flex-col ui:gap-[10px] ui:rounded-[32px] ui:bg-(--color-bg-light) ui:p-[30px] ui:max-md:w-[94svw] ui:max-md:p-[20px]">
        <p className="ui:mb-[5px] ui:text-xl ui:font-medium ui:text-black">Reset Password</p>
        {step === 1 && (
          <>
            <p className="ui:mb-[5px]">
              To reset your password, enter the email that you used assigned to your account.
            </p>
            <div className="ui:flex ui:w-full ui:rounded-lg ui:bg-(--color-hover-light) ui:px-[14px] ui:py-[7px] ui:font-light">
              <input
                className="ui:h-[40px] ui:flex-1 ui:bg-transparent ui:outline-none"
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                onChange={({ target }) => updateData("email", target.value)}
                placeholder="Enter your email"
                type="text"
                autoComplete="off"
                autoFocus
                value={data.email ?? ""}
              />
            </div>
            <button
              className="ui:mt-[10px] ui:flex ui:w-full ui:cursor-pointer ui:justify-center ui:rounded-lg ui:bg-(--color-accent-500) ui:px-[14px] ui:py-[14px] ui:text-white ui:transition-colors ui:hover:bg-(--color-accent-500)/80 ui:disabled:opacity-60"
              disabled={loading || !data.email?.trim()?.length}
              onClick={handleSendOTP}
            >
              {loading ? "Sending..." : "Confirm"}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <p className="ui:mb-[5px]">
              We have sent a verification code to <span className="text-accent-500">{data.email}</span>
            </p>
            <div className="ui:flex ui:w-full ui:rounded-lg ui:bg-(--color-hover-light) ui:px-[14px] ui:py-[7px]">
              <input
                className="ui:h-[40px] ui:flex-1 ui:bg-transparent ui:outline-none"
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                onChange={({ target }) => updateData("token", target.value)}
                placeholder="Enter the 6 digit OTP sent to your email.."
                type="text"
                autoComplete="off"
                value={data.token ?? ""}
              />
            </div>
            <div className="ui:flex ui:w-full ui:rounded-lg ui:bg-(--color-hover-light) ui:px-[14px] ui:py-[7px]">
              <input
                className="ui:h-[40px] ui:flex-1 ui:bg-transparent ui:outline-none"
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                onChange={({ target }) => updateData("new_password", target.value)}
                placeholder="Enter new password.."
                type="password"
                autoComplete="off"
                value={data.new_password ?? ""}
              />
            </div>
            <button
              className="ui:mt-[10px] ui:flex ui:w-full ui:cursor-pointer ui:justify-center ui:rounded-lg ui:bg-(--color-accent-500) ui:px-[14px] ui:py-[14px] ui:text-white ui:transition-colors ui:hover:bg-(--color-accent-500)/80 ui:disabled:opacity-60"
              disabled={loading || !data.token?.length || !data.new_password?.length}
              onClick={handleResetPassword}
            >
              {loading ? "Confirming..." : "Confirm"}
            </button>
            <button
              onClick={handleResendOTP}
              disabled={loading || resendTimer > 0}
              className="ui:flex ui:cursor-pointer ui:justify-center ui:rounded-lg ui:bg-(--color-accent-500) ui:px-[14px] ui:py-[14px] ui:text-white ui:transition-colors ui:hover:bg-(--color-accent-500)/80 ui:disabled:opacity-60"
            >
              {loading ? "..." : resendTimer > 0 ? formatTimer(resendTimer) : "Resend OTP"}
            </button>
          </>
        )}
        <button
          className="ui:flex ui:cursor-pointer ui:justify-center ui:rounded-lg ui:px-[14px] ui:py-[7px] ui:text-gray-500 ui:hover:text-black"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </WrapperRoot>
  );
};
