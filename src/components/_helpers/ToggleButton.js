import { useState } from "react";

import "@styles/system/ToggleButton.css";

export default function ToggleButton({ text, onChangeFunc }) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="em-toggle_container">
      <button
        className={`em-toggle_button-${isToggled ? "on" : "off"}`}
        onClick={() => {
          setIsToggled(!isToggled);
          onChangeFunc(!isToggled);
        }}
      >
        {isToggled ? "on" : "off"}
      </button>
      <p className="em-toggle_text">{text}</p>
    </div>
  );
}
