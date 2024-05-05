import { request } from 'https'



export const callWebhook = async (url: string, courseName: string) => {
  let data = {
    "content": null,
    "embeds": [
      {
        "description": courseName,
        "color": 100425
      }
    ],
    "attachments": []
  };
  let postRequest = request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, });

  postRequest.write(JSON.stringify(data));
  postRequest.end();

}