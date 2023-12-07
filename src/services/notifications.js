import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";
import { default as EventEmitter } from "../event/eventEmitter";
import { default as store } from "../store/store.js";

let sw = null;

export const notificationQueueByCid = {};

async function showLocalNotification(pushMessage) {
  const storeState = store.getState();
  const selectedConversation = storeState.selectedConversation.value.id;

  console.log(
    "[push]",
    document.hasFocus(),
    selectedConversation === pushMessage.cid,
    selectedConversation,
    pushMessage.cid
  );
  if (document.hasFocus() && selectedConversation === pushMessage.cid) {
    console.log("[push] return");
    return;
  }

  const conversation = storeState.conversations.entities[pushMessage.cid];
  //ERROR: if conversation not found (new message from new user) - case failed
  if (!conversation) {
    if (notificationQueueByCid[pushMessage.cid]) {
      notificationQueueByCid[pushMessage.cid].push(pushMessage);
    } else {
      notificationQueueByCid[pushMessage.cid] = [pushMessage];
    }
    return;
  }

  const { attachments, from, body } = pushMessage;
  const userLogin = storeState.participants.entities[from]?.login;

  const attachmentText =
    attachments?.length > 0
      ? attachments.length > 1
        ? "\nPhotos"
        : "\nPhoto"
      : "";

  const title =
    conversation?.type === "u"
      ? userLogin
      : `${userLogin} | ${conversation?.name}`;

  const notificationMessage = {
    ...pushMessage,
    body: `${body}${attachmentText}`,
    title,
  };
  console.log("[push] send push");
  sw.postMessage({ message: notificationMessage }); /// possible error notificationMessage
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
