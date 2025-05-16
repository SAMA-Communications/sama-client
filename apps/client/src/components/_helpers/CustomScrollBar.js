import Scrollbars from "react-custom-scrollbars-2";

export default function CustomScrollBar({
  children,
  customStyle,
  customClassName,
  childrenClassName = "",
  customId,
  autoHide = true,
  autoHeight = false,
  autoHeightMax,
}) {
  return (
    <Scrollbars
      className={`scroll-bar__outer-container ${customClassName}`}
      autoHide={autoHide}
      autoHideTimeout={400}
      autoHideDuration={400}
      autoHeight={autoHeight}
      autoHeightMax={autoHeightMax}
      style={customStyle}
      renderView={(props) => (
        <div {...props} className={childrenClassName} id={customId} />
      )}
    >
      {children}
    </Scrollbars>
  );
}
