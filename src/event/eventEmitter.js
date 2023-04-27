class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    !this.events[eventName] && (this.events[eventName] = []);
    this.events[eventName].push(callback);
  }

  async emit(eventName, args) {
    const event = this.events[eventName];
    if (event) {
      for (const callback of event) {
        await callback.call(null, args);
      }
    }
  }

  unsubscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(
      (eventCallback) => callback !== eventCallback
    );
  }

  clearAllEvent() {
    this.events = {};
  }
}

export default new EventEmitter();
