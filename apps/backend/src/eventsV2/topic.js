const { EventBus } = require("estacion");
const SERVER_EVENTS = require("./topicsName");

const bus = new EventBus();
const mainChannel = bus.channel("MAINCHANNEL");

Object.values(SERVER_EVENTS).forEach((eventName) => {
  mainChannel.topic(eventName);
});

module.exports = { mainChannel };
