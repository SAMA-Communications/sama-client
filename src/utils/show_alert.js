import "./../styles/Alert.css";

export default function showCustomAlert(message) {
  let existingAlert = document.querySelector(".alert");
  let timeBar = document.querySelector(".time-bar");

  if (existingAlert) {
    existingAlert.style.opacity = "0";
    timeBar.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(existingAlert);
      createAlert(message);
    }, 300);
  } else {
    createAlert(message);
  }
}

function createAlert(message) {
  const customAlert = document.createElement("div");
  customAlert.className = "alert";
  customAlert.textContent = message;

  const timeBar = document.createElement("div");
  timeBar.className = "time-bar";

  customAlert.appendChild(timeBar);
  document.body.appendChild(customAlert);

  setTimeout(() => {
    customAlert.style.opacity = "1";
    timeBar.style.opacity = "1";
    timeBar.style.width = "0";
    timeBar.style.borderBottomRightRadius = "0";
    timeBar.style.borderTopRightRadius = "10px";
  }, 10);

  setTimeout(() => {
    customAlert.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(customAlert);
    }, 300);
  }, 5000);
}

export function showAlert(message) {
  const customAlert = document.createElement("div");
  customAlert.className = "alert";
  customAlert.textContent = message;

  const hideAlertFunc = () => {
    customAlert.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(customAlert);
    }, 300);
  };

  document.body.appendChild(customAlert);

  setTimeout(() => {
    customAlert.style.opacity = "1";
  }, 10);

  customAlert.onclick = hideAlertFunc;
  setTimeout(hideAlertFunc, 4000);
}
