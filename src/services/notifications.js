import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";
import { default as EventEmitter } from "../event/eventEmitter";
import { default as store } from "../store/store.js";

let sw = null;

async function showLocalNotification(pushMessage) {
  const storeState = store.getState();
  const selectedConversation = storeState.selectedConversation.value.id;

  if (document.hasFocus() && selectedConversation === pushMessage.cid) {
    return;
  }

  const conversation = storeState.conversations.entities[pushMessage.cid];
  //ERROR: if conversation not found (new message from new user) - case failed
  if (!conversation) {
    //TODO: need to sync with server | conversation_list
    return;
  }

  const { attachments, from, body, x } = pushMessage;
  if (x?.type === "added_participant") {
    const notificationMessage = {
      ...pushMessage,
      title: conversation.name,
      body: "New user has been added to the group",
    };
    sw.postMessage({ message: notificationMessage });
    return;
  }

  const userLogin = storeState.participants.entities[from]?.login;

  const attachmentText =
    attachments?.length > 0
      ? attachments.length > 1
        ? "\nPhotos"
        : "\nPhoto"
      : "";

  const title =
    conversation.type === "u"
      ? userLogin
      : `${userLogin} | ${conversation.name}`;

  const notificationMessage = {
    ...pushMessage,
    body: `${body}${attachmentText}`,
    title,
  };
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
