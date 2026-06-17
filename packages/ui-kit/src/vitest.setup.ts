import "@testing-library/jest-dom/vitest";

import "./__mocks__/motion-react-m";
import "./__mocks__/external-lib.mock";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

/** jsdom does not implement `scrollIntoView`; components that call it (e.g. ConversationInput) would warn otherwise. */
Element.prototype.scrollIntoView = function scrollIntoViewStub() {};
