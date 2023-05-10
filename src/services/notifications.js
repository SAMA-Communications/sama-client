import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";

export default function subscribeForNotifications() {
  console.log(process.env.REACT_APP_PUBLIC_VAPID_KEY);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) =>
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
          )
      )
      .catch((err) => console.log(err));
  }
}
