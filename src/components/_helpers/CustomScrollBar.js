import Scrollbars from "react-custom-scrollbars-2";

export default function CustomScrollBar({
  children,
  customStyle,
  customId,
  autoHeight = false,
  autoHeightMax,
}) {
  return (
    <Scrollbars
      className="scroll-bar__outer-container"
      autoHide
      autoHideTimeout={400}
      autoHideDuration={400}
      autoHeight={autoHeight}
      autoHeightMax={autoHeightMax}
      style={customStyle}
      renderView={(props) => <div {...props} id={customId} />}
    >
      {children}
    </Scrollbars>
  );
}
