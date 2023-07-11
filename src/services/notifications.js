import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";
import { default as EventEmitter } from "../event/eventEmitter";
import { default as store } from "../store/store.js";

let sw = null;

async function showLocalNotification(pushMessage) {
  if (document.hasFocus()) {
    return;
  }

  const storeState = store.getState();
  const conversation = storeState.conversations.entities[pushMessage.cid];
  //if conversation not found (new message from new user) - case failed
  if (!conversation) {
    //need to sync with server | conversation_lsit
    return;
  }
  const userLogin = storeState.participants.entities[pushMessage.from]?.login;
  if (pushMessage.attachments?.length) {
    pushMessage["body"] += `\nPhoto`;
  }
  pushMessage["title"] =
    conversation.type === "u"
      ? userLogin
      : `${userLogin} | ${conversation.name}`;

  sw.postMessage({ message: pushMessage });
}
EventEmitter.subscribe("onMessage", showLocalNotification);

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
