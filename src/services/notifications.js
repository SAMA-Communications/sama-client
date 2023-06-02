import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";

console.log("PUBLIC_VAPID_KEY", process.env.REACT_APP_PUBLIC_VAPID_KEY)

export default function subscribeForNotifications() {
  console.log("subscribeForNotifications")
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
          .then((sub) => {
            //TODO: optimize ?btoa?
            const data = {
              web_endpoint: sub.endpoint,
              web_key_auth: btoa(
                String.fromCharCode(...new Uint8Array(sub.getKey("auth")))
              ),
              web_key_p256dh: btoa(
                String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")))
              ),
            }
            console.log("data", data)
            return api.pushSubscriptionCreate(data)
          })
      )
      .catch((err) => console.log(err));
  }
}
