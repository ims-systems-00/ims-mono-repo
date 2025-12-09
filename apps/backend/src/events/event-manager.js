const EventEmitter = require("events");
class EventManager {
  constructor() {
    if (!EventManager.instance) {
      EventManager.instance = new EventEmitter();
    }
  }
  getInstance() {
    return EventManager.instance;
  }
  register(eventsHandlers) {
    Object.keys(eventsHandlers).forEach((eventName) => {
      EventManager.instance.on(eventName, function (data) {
        if (!data?.accessControl)
          throw new Error(
            "Access control is required to manage automated activity."
          );
        data.connection = data?.accessControl;
        eventsHandlers[eventName](data);
      });
    });
  }
}
module.exports = new EventManager();
