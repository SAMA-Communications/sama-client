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

self.addEventListener("notificationclick", (e) =>
  clients.openWindow(
    `${self.location.origin}/main` + e.notification.data?.convId
  )
);

//CLIENT TODO: add reconect to chat after update tocken
