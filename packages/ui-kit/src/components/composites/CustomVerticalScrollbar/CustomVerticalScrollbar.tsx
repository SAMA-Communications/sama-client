import { useRef, useState, useCallback, useEffect } from "react";

import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

import type { CustomVerticalScrollbarProps } from "@composites/CustomVerticalScrollbar/CustomVerticalScrollbar.types";

import { WrapperRoot } from "@elements/WrapperRoot";

import {
  SCROLL_STOP_DEBOUNCE_MS,
  SCROLLBAR_DEFAULT_AUTO_HIDE_DELAY,
  SCROLLBAR_DEFAULT_HOVER_SHOW_DELAY,
  SCROLLBAR_DEFAULT_MIN_THUMB_HEIGHT,
} from "@utils/constants";

export const CustomVerticalScrollbar = ({
  containerRef: containerRefProp,
  children,
  onScroll,
  onScrollStop,
  isScrollToBottomVisible = false,
  onScrollToBottom,
  minThumbHeight = SCROLLBAR_DEFAULT_MIN_THUMB_HEIGHT,
  autoHideDelay = SCROLLBAR_DEFAULT_AUTO_HIDE_DELAY,
  hoverShowDelay = SCROLLBAR_DEFAULT_HOVER_SHOW_DELAY,
  containerId: containerIdProp,
  customId,
  persistScrollPosition = true,
  className = "",
  contentClassName = "",
  customClassName = "",
  childrenClassName = "",
  customStyle,
  autoHeight = false,
  autoHeightMax,
  ...rest
}: CustomVerticalScrollbarProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = containerRefProp ?? internalRef;
  const containerId = containerIdProp ?? customId;
  const shouldPersistScroll = Boolean(containerId) && persistScrollPosition;

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);

  const resolvedClassName = className || customClassName;
  const resolvedContentClassName = contentClassName || childrenClassName;

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(
    (delay: number = autoHideDelay) => {
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        setScrollbarVisible(false);
        hideTimerRef.current = null;
      }, delay);
    },
    [autoHideDelay, clearHideTimer],
  );

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!container || !thumb || !track) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollableHeight = scrollHeight - clientHeight;
    if (scrollableHeight <= 0) {
      thumb.style.height = "0";
      thumb.style.transform = "translateY(0)";
      onScroll?.(scrollHeight - scrollTop - clientHeight);
      return;
    }

    const thumbHeight = Math.max((clientHeight / scrollHeight) * track.clientHeight, minThumbHeight);
    const thumbTop = (scrollTop / scrollableHeight) * (track.clientHeight - thumbHeight);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbTop}px)`;

    setScrollbarVisible(true);
    scheduleHide(autoHideDelay);

    const scrollFromBottom = scrollHeight - scrollTop - clientHeight;
    onScroll?.(scrollFromBottom);

    if (shouldPersistScroll || onScrollStop) {
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      scrollStopTimerRef.current = setTimeout(() => {
        if (shouldPersistScroll && container) {
          try {
            localStorage.setItem(`scroll_pos_${containerId}`, String(container.scrollTop));
          } catch (_) {}
        }
        onScrollStop?.(container.scrollTop);
        scrollStopTimerRef.current = null;
      }, SCROLL_STOP_DEBOUNCE_MS);
    }
  }, [containerRef, containerId, shouldPersistScroll, minThumbHeight, autoHideDelay, onScroll, onScrollStop, scheduleHide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (shouldPersistScroll) {
      try {
        const saved = localStorage.getItem(`scroll_pos_${containerId}`);
        if (saved != null) container.scrollTop = Number(saved);
      } catch (_) {}
    }
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    const ro = new ResizeObserver(() => handleScroll());
    ro.observe(container);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      ro.disconnect();
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    };
  }, [containerRef, containerId, shouldPersistScroll, handleScroll]);

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const startY = e.clientY;
      const startScroll = container.scrollTop;

      const onMove = (ev: MouseEvent) => {
        const delta = (ev.clientY - startY) * (container.scrollHeight / track.clientHeight);
        container.scrollTop = Math.max(
          0,
          Math.min(container.scrollHeight - container.clientHeight, startScroll + delta),
        );
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [containerRef],
  );

  const handleTrackMouseEnter = useCallback(() => {
    clearHideTimer();
    setScrollbarVisible(true);
  }, [clearHideTimer]);

  const handleTrackMouseLeave = useCallback(() => {
    scheduleHide(hoverShowDelay);
  }, [scheduleHide, hoverShowDelay]);

  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  const outerStyle: React.CSSProperties = {
    ...customStyle,
    ...(autoHeight && autoHeightMax != null
      ? { maxHeight: typeof autoHeightMax === "number" ? `${autoHeightMax}px` : autoHeightMax }
      : {}),
  };

  return (
    <WrapperRoot
      className={clsx(
        "custom-vertical-scrollbar ui:relative ui:flex ui:min-w-0 ui:w-full ui:max-w-full ui:grow ui:flex-col ui:self-center ui:overflow-hidden",
        resolvedClassName,
      )}
      style={Object.keys(outerStyle).length ? outerStyle : undefined}
      {...rest}
    >
      <div
        ref={containerRef}
        id={containerId}
        className={`ui:h-full ui:min-w-0 ui:w-full ui:overflow-y-scroll ui:[&::-webkit-scrollbar]:hidden ${resolvedContentClassName}`}
        onScroll={handleScroll}
      >
        {children}
      </div>
      <div
        ref={trackRef}
        className={`ui:absolute ui:top-0 ui:right-1 ui:h-full ui:w-1.5 ui:transition-opacity ui:duration-250 ${
          scrollbarVisible ? "" : "ui:opacity-0"
        }`}
        onMouseEnter={handleTrackMouseEnter}
        onMouseLeave={handleTrackMouseLeave}
        role="scrollbar"
        aria-orientation="vertical"
      >
        <div
          ref={thumbRef}
          className="ui:active:ui:cursor-grabbing ui:absolute ui:top-0 ui:w-full ui:cursor-grab ui:rounded-full ui:bg-black/30"
          onMouseDown={startDrag}
        />
      </div>
      {isScrollToBottomVisible && onScrollToBottom && (
        <button
          type="button"
          className="ui:absolute ui:right-0.75 ui:bottom-4 ui:z-4 ui:flex ui:h-10 ui:w-10 ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-xl ui:border-0 ui:bg-white ui:shadow-btn"
          onClick={onScrollToBottom}
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={24} />
        </button>
      )}
    </WrapperRoot>
  );
};
