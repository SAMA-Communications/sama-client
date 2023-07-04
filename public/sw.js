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
      convId: `/#${data.cid}`,
    },
  };

  e.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .catch((err) => console.error("Notification error:", err))
  );
});

self.addEventListener("message", (event) => {
  console.log(event.data);
});

self.addEventListener("notificationclick", (e) => {
  clients.openWindow(
    `${self.location.origin}/main` + e.notification.data?.convId
  );
});

//CLIENT TODO: add reconect to chat after update tocken
