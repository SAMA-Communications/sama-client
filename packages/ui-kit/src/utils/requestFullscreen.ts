type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

type DocumentWithFullscreen = Document & {
  webkitExitFullscreen?: () => void;
  webkitFullscreenElement?: Element | null;
};

/**
 * Safari / iOS: uses webkitRequestFullscreen on elements or webkitEnterFullscreen on HTMLVideoElement.
 */
export function requestElementFullscreen(element: HTMLElement | null): Promise<void> | void {
  if (!element) return;

  if (element instanceof HTMLVideoElement) {
    const v = element as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (typeof v.webkitEnterFullscreen === "function") {
      try {
        v.webkitEnterFullscreen();
      } catch {
        /* ignore */
      }
      return;
    }
  }

  const el = element as FullscreenElement;
  if (typeof el.requestFullscreen === "function") {
    return el.requestFullscreen().catch(() => {
      if (typeof el.webkitRequestFullscreen === "function") {
        el.webkitRequestFullscreen();
      }
    });
  }
  if (typeof el.webkitRequestFullscreen === "function") {
    el.webkitRequestFullscreen();
  }
}

export function exitDocumentFullscreen(): Promise<void> | void {
  const doc = document as DocumentWithFullscreen;
  if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
    return document.exitFullscreen().catch(() => undefined);
  }
  if (doc.webkitFullscreenElement && typeof doc.webkitExitFullscreen === "function") {
    doc.webkitExitFullscreen();
  }
}
