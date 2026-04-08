import getBrowserFingerprint from "get-browser-fingerprint";

import { default as EventEmitter } from "@lib/eventEmitter";

import { SAMAClient } from "@sama-communications.sdk";

import { default as reduxStore } from "@store/store";
import { updateNetworkState } from "@store/values/NetworkState";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";

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
  organization_id: import.meta.env.VITE_ORGANIZATION_ID,
};
const api = new SAMAClient(config);
getBrowserFingerprint({ hardwareOnly: true }).then(
  (deviceId) => (api.deviceId = deviceId.toString())
);

api.onConnectEvent = onConnect;
api.onDisconnectEvent = onDisconnect;
api.onMessageEvent = onMessage;
api.connect();

export default api;
