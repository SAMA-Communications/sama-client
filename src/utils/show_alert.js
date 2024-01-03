import "@styles/customs/Alert.css";

let timer = null;

const themes = {
  default: {
    textColor: "#fff",
    bgColor: "#6c757d",
  },
  success: {
    textColor: "#fff",
    bgColor: "#198754",
  },
  danger: {
    textColor: "#fff",
    bgColor: "#dc3545",
  },
  warning: {
    textColor: "#000",
    bgColor: "#ffc107",
  },
};

export default function showCustomAlert(message, themeStyle) {
  const existingAlert = document.querySelector(".alert");

  if (existingAlert) {
    existingAlert.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(existingAlert);
      createAndShowAlert(message, themeStyle);
    }, 300);
  } else {
    createAndShowAlert(message, themeStyle);
  }
}

function createAndShowAlert(message, themeStyle) {
  const theme = themes[themeStyle] || themes.default;

  const customAlert = document.createElement("div");
  customAlert.className = "alert";
  customAlert.textContent = message;
  customAlert.style.backgroundColor = theme.bgColor;
  customAlert.style.color = theme.textColor;

  document.body.appendChild(customAlert);

  clearTimeout(timer);
  setTimeout(() => (customAlert.style.opacity = "1"), 10);

  const hideAlert = () => {
    customAlert.style.opacity = "0";
    setTimeout(() => document.body.removeChild(customAlert), 300);
  };
  customAlert.onclick = () => {
    clearTimeout(timer);
    hideAlert();
  };

  timer = setTimeout(hideAlert, 3000);
}
