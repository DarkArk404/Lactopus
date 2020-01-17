const fs = require("fs");
const baseUserPath = "/app/data/users/";
const baseGroupPath = "/app/data/groups/";
const baseTimerPath = "/app/data/timer/";

module.exports = {
  client: "",
  event: "",
  group_session: {},
  
  receive: function(client, event) {
    this.client = client;
    this.event = event;

    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    switch (this.event.type) {
      case "follow":
        return this.followResponse();
      case "join":
        return this.joinResponse(groupId);
      case "leave":
        return this.leaveResponse(groupId);
      case "memberJoined":
        return this.memberJoinedResponse(groupId);
      case "memberLeft":
        return this.memberLeftResponse();
    }
  },

  memberLeftResponse: function() {
    let userId = this.event.left.members[0].userId;
    let path = baseUserPath + userId + "_user.json";

    try {
      var data = fs.readFileSync(path);
      this.user_session = JSON.parse(data);
      this.user_session.status = "inactive";
      this.user_session.groupId = "";
      this.saveUserData();
    } catch (err) {
      console.log("memberLeftResponse err");
    }
    
  },

  followResponse: function() {
    let flex_text = {
      header: {
        text: "👋 Haiii"
      },
      body: {
        text:
          "Thanks udah add bot ini 😃, undang bot ini ke group kamu untuk bermain!\n📚 Untuk bantuan bisa ketik '/help' atau '/cmd'"
      }
    };
    return this.replyFlex(flex_text);
  },

  joinResponse: function(groupId) {
    let groupPath = baseGroupPath + groupId + "_group.json";
    
    try {
      var data = fs.readFileSync(groupPath);
      this.group_session = JSON.parse(data);
      
      this.group_session.status = "active"
      
      this.saveGroupData();
      
    } catch (err) {
      console.log("bot join err");
    }
    
    let flex_text = {
      header: {
        text: "👋 Hai semuaa"
      },
      body: {
        text: "Thanks udah undang bot ini 😃, ketik '/help' atau '/cmd' untuk bantuan"
      }
    };
    return this.replyFlex(flex_text);
  },

  leaveResponse: function(groupId) {
    let groupPath = baseGroupPath + groupId + "_group.json";
    let timerPath = baseTimerPath + groupId + "_timer.json";
    try {
      var data = fs.readFileSync(groupPath);
      this.group_session = JSON.parse(data);
      
      var timerData = fs.readFileSync(timerPath);
      this.time_session = JSON.parse(timerData);
      
      this.time_session.time = 0;

      this.group_session.state = "idle";
      this.group_session.status = "inactive"

      this.resetAllPlayers();

      this.saveGroupData();
      
      this.saveTimeData();
      
    } catch (err) {
      console.log("bot leaveResponse err");
    }
  },

  memberJoinedResponse: function(groupId) {
    let newMemberId = this.event.joined.members[0].userId;
    let text = "";
    this.client
      .getGroupMemberProfile(groupId, newMemberId)
      .then(profile => {
        text =
          "👋 Selamat datang " + profile.displayName + ", maen Werewolf yok";
        return this.replyText(text);
      })
      .catch(err => {
        text = "👋 Selamat datang! Maen Werewolf yok";
        return this.replyText(text);
      });
  },

  /** message func **/

  replyFlex: function(flex_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session,
      flex_texts
    );
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  saveUserData: function() {
    const data = require("/app/src/data");
    data.saveUserData(this.user_session);
  },

  saveGroupData: function() {
    const data = require("/app/src/data");
    data.saveGroupData(this.group_session);
  },
  
  saveTimeData: function() {
    const data = require("/app/src/data");
    data.saveTimeData(this.time_session);
  },

  resetAllPlayers: function() {
    const data = require("/app/src/data");
    data.resetAllPlayers(this.group_session.players);
  }
};
