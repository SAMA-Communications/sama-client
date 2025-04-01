import { default as EventEmitter } from "@lib/eventEmitter";
import { default as reduxStore } from "@store/store";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

import { SAMAClient } from "../../../../packages/sdk/dist/@sama-communications.sdk.es.js";
// import { SAMAClient } from "@sama-communications/sdk";

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
const api = new SAMAClient(config);

api.onConnectEvent = onConnect;
api.onDisconnectEvent = onDisconnect;
api.onMessageEvent = onMessage;
api.connect();

export default api;
