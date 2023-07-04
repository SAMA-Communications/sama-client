console.log("[push.customer] SW.js init success!");
self.addEventListener("push", (e) => {
  const data = e.data.json();

  if (!("image" in Notification.prototype) && data.firstAttachmentUrl) {
    data.body += "\nPhoto";
  }

  const options = {
    body: data.body,
    icon: "logo.png",
    image: data.firstAttachmentUrl,
    data: {
      convId: `/#${data.data.cid}`,
    },
  };

  e.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .catch((err) => console.error("Notification error:", err))
  );
});

self.addEventListener("notificationclick", (e) => {
  //TODO: get host from env
  clients.openWindow(
    "http://localhost:3000/main" + e.notification.data?.convId
  );
});

//CLIENT TODO: add reconect to chat after update tocken
