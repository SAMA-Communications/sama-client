import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";
import { default as EventEmitter } from "../event/eventEmitter";

let sw = null;

function sendPushNotification(pushMessage) {
  !document.hasFocus() && sw.postMessage({ message: pushMessage });
}
EventEmitter.subscribe("onPushMessage", sendPushNotification);

export default function subscribeForNotifications() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        sw = reg.installing || reg.waiting || reg.active;
        reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.REACT_APP_PUBLIC_VAPID_KEY
            ),
          })
          .then((sub) =>
            //TODO: optimize ?btoa?
            api.pushSubscriptionCreate({
              web_endpoint: sub.endpoint,
              web_key_auth: btoa(
                String.fromCharCode(...new Uint8Array(sub.getKey("auth")))
              ),
              web_key_p256dh: btoa(
                String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")))
              ),
            })
          );
      })
      .catch((err) => console.log(err));
  }
}
