import "./../styles/Alert.css";

let timer = null;

export default function showCustomAlert(message) {
  const existingAlert = document.querySelector(".alert");
  const timeBar = document.querySelector(".time-bar");

  if (existingAlert) {
    existingAlert.style.opacity = "0";
    timeBar.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(existingAlert);
      createAndShowAlert(message);
    }, 300);
  } else {
    createAndShowAlert(message);
  }
}

function createAndShowAlert(message) {
  const customAlert = document.createElement("div");
  customAlert.className = "alert";
  customAlert.textContent = message;

  const timeBar = document.createElement("div");
  timeBar.className = "time-bar";

  customAlert.appendChild(timeBar);
  document.body.appendChild(customAlert);

  clearTimeout(timer);

  setTimeout(() => {
    customAlert.style.opacity = "1";
    timeBar.style.cssText = `
      opacity: 1;
      width: 0;
      border-bottom-right-radius: 0;
      border-top-right-radius: 10px;
    `;
  }, 10);

  timer = setTimeout(() => {
    customAlert.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(customAlert);
    }, 300);
  }, 3000);
}
