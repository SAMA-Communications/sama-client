class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    !this.events[eventName] && (this.events[eventName] = []);
    this.events[eventName].push(callback);
  }

  resubscribe(eventName, callback) {
    !this.events[eventName] && (this.events[eventName] = []);
    if (
      !this.events[eventName].find(
        (eventCallback) => callback.toString() === eventCallback.toString()
      )
    ) {
      this.events[eventName].push(callback);
    }
  }

  async emit(eventName, args) {
    const event = this.events[eventName];
    if (event) {
      for (const callback of event) {
        await callback.call(null, args);
      }
    }
  }

  hasSubscription(eventName, callback) {
    return !!this.events[eventName].find((eventCallback) => {
      return callback.toString() === eventCallback.toString();
    });
  }

  unsubscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(
      (eventCallback) => callback.toString() !== eventCallback.toString()
    );
  }

  clearAllEvent() {
    this.events = {};
  }
}

export default new EventEmitter();
