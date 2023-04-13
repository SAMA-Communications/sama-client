console.log("SW.js init!");
self.addEventListener("push", function (e) {
  const data = e.data.json();
  console.log("Data: ", data);
  self.registration.showNotification(data.title, {
    body: data.body,
  });
});
