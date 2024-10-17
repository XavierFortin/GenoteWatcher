export const callWebhook = (url: string, courseName: string) => {
  const data = {
    "content": null,
    "embeds": [
      {
        "description": courseName,
        "color": 100425
      }
    ],
    "attachments": []
  };
  const postRequest = new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

  fetch(postRequest).then(response => {
    if (response.status === 204) {
      console.log("Webhook sent successfully");
    } else {
      console.error("Error while sending webhook");
    }
  }).catch(err => {
    console.error(err);
  });

}