console.log("[push.customer] SW.js init success!");

function showNotification(e, data) {
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
}

self.addEventListener("push", (e) => showNotification(e, e.data.json()));

self.addEventListener("message", (e) => showNotification(e, e.data.message));

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        const chatUrl =
          `${self.location.origin}/main` + e.notification.data?.convId;

        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            chatUrl !== client.url && client.navigate(chatUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(chatUrl);
        }
      })
  );
});
