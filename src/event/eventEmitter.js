export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    !this.events[eventName] && (this.events[eventName] = []);
    this.events[eventName].push(callback);
  }

  emit(eventName, args) {
    const event = this.events[eventName];
    event && event.forEach((callback) => callback.call(null, args));
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
