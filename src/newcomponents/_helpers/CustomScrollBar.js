import Scrollbars from "react-custom-scrollbars-2";

export default function CustomScrollBar({ children, customStyle }) {
  return (
    <Scrollbars
      autoHide
      autoHideTimeout={400}
      autoHideDuration={400}
      style={customStyle}
      className="scroll-bar__outer-container"
    >
      {children}
    </Scrollbars>
  );
}
