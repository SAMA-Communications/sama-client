import api from "@api/api";
import getFileType from "@utils/media/get_file_type";
import urlBase64ToUint8Array from "@api/base64_to_uint8Array";
import { default as EventEmitter } from "@event/eventEmitter";
import { default as store } from "@store/store";

let sw = null;

export const notificationQueueByCid = {};

async function showLocalNotification(pushMessage) {
  const storeState = store.getState();
  const selectedConversation = storeState.selectedConversation.value.id;

  if (document.hasFocus() && selectedConversation === pushMessage.cid) {
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

  const typeOfLastAttachment = attachments
    ? getFileType(attachments?.slice(-1)[0].file_name)
    : "file";
  const attachmentText =
    attachments?.length > 0
      ? `\n${typeOfLastAttachment}${attachments.length > 1 ? "s" : ""}`
      : "";

  const title =
    conversation?.type === "u"
      ? userLogin
      : `${userLogin} | ${conversation?.name}`;

  const bodyCrop = body.length > 75 ? body.slice(0, 75) + "..." : body;
  const notificationMessage = {
    ...pushMessage,
    body: `${bodyCrop}${attachmentText}`,
    title,
  };

  sw && sw.postMessage({ message: notificationMessage }); /// possible error notificationMessage
}
EventEmitter.subscribe("onMessage", showLocalNotification);

export default function subscribeForNotifications() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
      return;
    }

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
  });
}
