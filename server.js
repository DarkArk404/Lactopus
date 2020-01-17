// server.js
// where your node app starts

// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.log(JSON.stringify(err, null, 2));
      //console.error("message error" , JSON.parse(err.originalError.config.data).messages);
    });
});

function handleEvent(event) {
  //Note: should return! So Promise.all could catch the error

  let args = [];
  
  if (event.type === "postback") {
    args = event.postback.data.split(" ");
    const data = require("/app/src/data");
    return data.receive(client, event, args);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    if (
      event.type === "join" ||
      event.type === "follow" ||
      event.type === "leave" ||
      event.type === "memberJoined" ||
      event.type === "memberLeft"
    ) {
      console.log(event);
      const other = require("/app/src/other");
      return other.receive(client, event);
    }

    return Promise.resolve(null);
  }

  //logging
  if (event.source.type === "group") {
    logChat(event.source.groupId, event.source.userId);
  }

  if (event.message.text.startsWith("/")) {
    args = event.message.text.split(" ");
    const data = require("/app/src/data");
    return data.receive(client, event, args);
  }

  /** logging func **/

  function logChat(groupId, userId) {
    client.getGroupMemberProfile(groupId, userId).then(p => {
      console.log(p.displayName + " : " + event.message.text);
    }).catch(() => {
      console.log("ga add : " + event.message.text);
    });
  }
}

// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
