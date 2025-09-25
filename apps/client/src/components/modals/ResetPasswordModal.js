import * as m from "motion/react-m";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";

import EmailInput from "@components/auth/elements/EmailInput.js";
import CustomInput from "@components/auth/elements/CustomInput.js";

import showCustomAlert from "@utils/show_alert.js";
import autoLoginService from "@services/autoLoginService.js";

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [data, setData] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    let timer;
    resendTimer > 0 &&
      (timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000));
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem("reset_email");
      if (savedEmail) {
        setData({ email: savedEmail });
        setStep(2);
      }
    } else {
      setStep(1);
      setData({});
      setLoading(false);
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    setLoading(true);
    const isSuccess = await autoLoginService.sendOtpToken(data.email?.trim());
    isSuccess && setStep(2);
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    const isSuccess = await autoLoginService.sendResetPassword(
      data.email,
      data.token,
      data.new_password
    );
    isSuccess && onClose();
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (!data.email) {
      showCustomAlert("No email to resend token.", "warning");
      return;
    }
    setLoading(true);
    await autoLoginService.resendOtpToken(data.email?.trim());
    setLoading(false);
    setResendTimer(90);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    localStorage.removeItem("reset_email");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          className="fixed inset-0 flex items-center justify-center bg-(--color-black-50) z-50"
          initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          transition={{ duration: 0.2 }}
        >
          <m.div
            className={`p-[30px] flex flex-col gap-[10px] rounded-[32px] bg-(--color-bg-light) w-[min(460px,100%)] max-md:w-[94svw] max-md:p-[20px] max-h-[80svh]`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="!text-h5 !font-normal text-black mb-[5px]">
              Reset Password
            </p>
            {step === 1 && (
              <>
                <p className="mb-[5px]">
                  To reset your password, enter the email that you used assigned
                  to your account.
                </p>
                <EmailInput setState={setData} />
                <button
                  className="w-full mt-[10px] py-[14px] px-[14px] flex justify-center text-white bg-(--color-accent-dark) hover:bg-(--color-accent-dark)/80 transition-colors rounded-lg cursor-pointer"
                  disabled={loading || !data.email?.length}
                  onClick={handleSendOTP}
                >
                  {loading ? "Sending..." : "Confirm"}
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <p className="mb-[5px]">
                  We have sent a verification code to{" "}
                  <span className="text-accent-dark">{data.email}</span>.
                </p>
                <CustomInput
                  setState={setData}
                  name="token"
                  placeholder="Enter the 6 digit OTP sent to your email.."
                />
                <CustomInput
                  setState={setData}
                  name="new_password"
                  placeholder="Enter new password.."
                />
                <button
                  className="w-full mt-[10px] py-[14px] px-[14px] flex justify-center text-white bg-(--color-accent-dark) hover:bg-(--color-accent-dark)/80 transition-colors rounded-lg cursor-pointer"
                  disabled={
                    loading || !data.token?.length || !data.new_password?.length
                  }
                  onClick={handleResetPassword}
                >
                  {loading ? "Confirming..." : "Confirm"}
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={loading || resendTimer}
                  className="py-[14px] px-[14px] flex justify-center text-white bg-(--color-accent-dark) hover:bg-(--color-accent-dark)/80 transition-colors rounded-lg cursor-pointer"
                >
                  {loading
                    ? "..."
                    : resendTimer
                    ? formatTimer(resendTimer)
                    : "Resend OTP"}
                </button>
              </>
            )}
            <button
              className="py-[7px] px-[14px] flex justify-center text-gray-500 hover:text-black  rounded-lg cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
