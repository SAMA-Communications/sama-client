import { default as EventEmitter } from "@lib/eventEmitter";
import { default as reduxStore } from "@store/store";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

import { SAMAClient } from "sama-sdk";

const onConnect = () => {
  EventEmitter.emit("onConnect");
  reduxStore.dispatch(updateNetworkState(true));
};
const onDisconnect = () => {
  reduxStore.dispatch(updateNetworkState(false));
  reduxStore.dispatch(setUserIsLoggedIn(false));
};
const onMessage = (message) => {
  EventEmitter.emit("onMessage", message);
};

const config = {
  endpoint: {
    ws: import.meta.env.VITE_SOCKET_CONNECT,
    http: import.meta.env.VITE_HTTP_CONNECT,
  },
};
console.log(config);

const api = new SAMAClient(config);

api.onConnectEvent = onConnect;
api.onDisconnectEvent = onDisconnect;
api.onMessageEvent = onMessage;
api.connect();

console.log(api);

export default api;
