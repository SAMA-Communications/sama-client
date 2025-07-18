import { useRef, useEffect } from "react";
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
  onScrollStop,
}) {
  const scrollableContainer = useRef(null);

  useEffect(() => {
    if (!customId) return;
    const savedScroll = localStorage.getItem(`scroll_pos_${customId}`);
    if (savedScroll && scrollableContainer.current) {
      scrollableContainer.current.scrollTop(Number(savedScroll));
    }
  }, [customId]);

  return (
    <Scrollbars
      ref={scrollableContainer}
      className={`scroll-bar__outer-container ${customClassName}`}
      autoHide={autoHide}
      autoHideTimeout={400}
      autoHideDuration={400}
      autoHeight={autoHeight}
      autoHeightMax={autoHeightMax}
      style={customStyle}
      onScrollStop={
        onScrollStop ? () => onScrollStop(scrollableContainer) : null
      }
      renderView={(props) => (
        <div {...props} className={childrenClassName} id={customId} />
      )}
    >
      {children}
    </Scrollbars>
  );
}
