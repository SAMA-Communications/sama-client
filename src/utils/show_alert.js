import "./../styles/Alert.css";

let timer = null;

const themes = {
  default: {
    textColor: "#fff",
    timeBarColor: "#adb5bd",
    bgColor: "#6c757d",
  },
  success: {
    textColor: "#fff",
    timeBarColor: "#9bffd0",
    bgColor: "#198754",
  },
  danger: {
    textColor: "#fff",
    timeBarColor: "#fd9ca6",
    bgColor: "#dc3545",
  },
  warning: {
    textColor: "#000",
    timeBarColor: "#ffe69a",
    bgColor: "#ffc107",
  },
};

export default function showCustomAlert(message, themeStyle) {
  const existingAlert = document.querySelector(".alert");
  const timeBar = document.querySelector(".time-bar");

  if (existingAlert) {
    existingAlert.style.opacity = "0";
    timeBar.style.opacity = "0";

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

  const timeBar = document.createElement("div");
  timeBar.className = "time-bar";
  timeBar.style.backgroundColor = theme.timeBarColor;

  customAlert.appendChild(timeBar);
  document.body.appendChild(customAlert);

  clearTimeout(timer);

  setTimeout(() => {
    customAlert.style.opacity = "1";
    timeBar.style.opacity = 1;
    timeBar.style.width = 0;
    timeBar.style.borderBottomRightRadius = 0;
    timeBar.style.borderTopRightRadius = "10px";
  }, 10);

  const hideAlert = () => {
    customAlert.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(customAlert);
    }, 300);
  };
  customAlert.onclick = () => {
    clearTimeout(timer);
    hideAlert();
  };

  timer = setTimeout(hideAlert, 5000);
}
