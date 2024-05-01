import https from 'https'


export const callWebhook = async (url: string, courseName: string) => {
  let data = {
    "content": null,
    "embeds": [
      {
        "description": courseName,
        "color": 62975
      }
    ],
    "attachments": []
  };
  let request = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, });

  request.write(JSON.stringify(data));
  request.end();

}