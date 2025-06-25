export default class VisibilityObserver {
  #triggerArea;
  #observer = null;
  #callbacks = new Map(); // el => { callback, once, isRunning }
  #containerId;
  #pendingObserves = [];
  #hasTriedInit = false;

  constructor({ scrollContainerId, triggerRange = "100px 0px 100px 0px" }) {
    this.#triggerArea = triggerRange;
    this.#containerId = scrollContainerId;

    this.#initObserver();
  }

  #initObserver() {
    const rootElement = document.getElementById(this.#containerId);
    if (!rootElement) {
      if (!this.#hasTriedInit) {
        this.#hasTriedInit = true;
        const retryInterval = setInterval(() => {
          const rootEl = document.getElementById(this.#containerId);
          if (rootEl) {
            clearInterval(retryInterval);
            this.#createObserver(rootEl);
            this.#flushPendingObserves();
          }
        }, 100);
      }
      return;
    }

    this.#createObserver(rootElement);
  }

  #createObserver(rootElement) {
    this.#observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const data = this.#callbacks.get(entry.target);
          if (entry.isIntersecting && data && !data.isRunning) {
            data.isRunning = true;
            Promise.resolve(data.callback(entry.target)).finally(() => {
              data.isRunning = false;
              if (data.once) {
                this.unobserve(entry.target);
              }
            });
          }
        });
      },
      {
        root: rootElement,
        rootMargin: this.#triggerArea,
        threshold: 0.01,
      }
    );
  }

  #flushPendingObserves() {
    this.#pendingObserves.forEach(({ element, callback, once }) => {
      this.observe(element, callback, once);
    });
    this.#pendingObserves = [];
  }

  observe(element, callback, once = false) {
    if (!(element instanceof Element)) {
      console.warn("Tried to observe non-element:", element);
      return;
    }

    if (!this.#observer) {
      this.#pendingObserves.push({ element, callback, once });
      return;
    }

    this.#callbacks.set(element, {
      callback,
      once,
      isRunning: false,
    });

    this.#observer.observe(element);
  }

  unobserve(element) {
    this.#callbacks.delete(element);
    if (this.#observer && element instanceof Element) {
      this.#observer.unobserve(element);
    }
  }

  disconnect() {
    if (this.#observer) {
      this.#observer.disconnect();
      this.#callbacks.clear();
    }
  }
}

const messageObserver = new VisibilityObserver({
  scrollContainerId: "chatMessagesScrollable",
});

export { messageObserver };
