import { FC, useRef, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { CustomScrollBarProps } from "./CustomScrollBar.types";

export const CustomScrollBar: FC<CustomScrollBarProps> = ({
  children,
  customStyle,
  customClassName = "",
  childrenClassName = "",
  customId,
  autoHide = true,
  autoHeight = false,
  autoHeightMax,
  onScrollStop,
}) => {
  const scrollableContainer = useRef<Scrollbars>(null);

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
        onScrollStop ? () => onScrollStop(scrollableContainer) : undefined
      }
      renderView={(props) => (
        <div {...props} className={childrenClassName} id={customId} />
      )}
    >
      {children}
    </Scrollbars>
  );
};
