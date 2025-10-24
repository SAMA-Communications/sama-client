import { MAX_TTOASTS, TOAST_THEME } from "@utils/constants.js";

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const toastTimers = new Map();

export function showCustomAlert(message, themeStyle) {
  createAndShowAlert(message, themeStyle);
}

function createAndShowAlert(message, themeStyle) {
  const theme = TOAST_THEME[themeStyle] || TOAST_THEME.default;

  const customAlert = document.createElement("div");
  customAlert.className =
    "custom-toast fixed left-1/2 max-w-[98vw] w-max h-auto px-[25px] py-[10px] text-center !font-normal transform -translate-x-1/2 transition-all duration-300 rounded-[5px] shadow-lg overflow-hidden cursor-pointer z-1000 opacity-0";
  customAlert.textContent = message;
  customAlert.style.backgroundColor = theme.bgColor;
  customAlert.style.color = theme.textColor;

  document.body.prepend(customAlert);

  setTimeout(() => {
    customAlert.style.opacity = "1";
    repositionToasts();
  }, 10);

  customAlert.onclick = () => {
    clearTimeout(toastTimers.get(customAlert));
    toastTimers.delete(customAlert);
    removeToast(customAlert);
  };

  const timer = setTimeout(() => {
    toastTimers.delete(customAlert);
    removeToast(customAlert);
  }, 3000);

  toastTimers.set(customAlert, timer);

  cleanupOldToasts();
}

function removeToast(toast) {
  toast.style.opacity = "0";
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
      repositionToasts();
    }
  }, 300);
}

function cleanupOldToasts() {
  const toasts = Array.from(document.querySelectorAll(".custom-toast"));
  while (toasts.length > MAX_TTOASTS) {
    const oldest = toasts.pop();
    clearTimeout(toastTimers.get(oldest));
    toastTimers.delete(oldest);
    removeToast(oldest);
  }
}

function repositionToasts() {
  const toasts = Array.from(document.querySelectorAll(".custom-toast"));
  toasts.forEach((toast, index) => {
    const offset = 25 + index * 20;
    const opacity = 1 - index * 0.3;
    const scale = 1 - index * 0.05;

    toast.style.top = `${offset}px`;
    toast.style.opacity = `${opacity}`;
    toast.style.transform = `scale(${scale})`;
    toast.style.zIndex = `${1000 - index}`;
  });
}
