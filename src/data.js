const fs = require("fs");
module.exports = {
  client: "",
  event: "",
  args: [],
  group_session: {},
  user_session: {},
  time_session: {},

  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    if (!this.event.source.hasOwnProperty("userId")) {
      return this.replyText(
        "💡 This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
      );
    }
    console.log(args);
    this.searchUser(this.event.source.userId);
  },

  searchUser: function(id) {
    try {
      let userData = fs.readFileSync("/app/data/users/" + id + "_user.json");
      this.searchUserCallback(userData);
    } catch (err) {
      let newUser = {
        id: id,
        name: "",
        state: "inactive",
        groupId: ""
      };
      let userData = JSON.stringify(newUser, null, 2);
      this.searchUserCallback(userData);
    }
  },

  searchUserCallback: function(userData) {
    this.user_session = JSON.parse(userData);

    if (this.event.source.type === "group") {
      return this.searchGroup(this.event.source.groupId);
    } else if (this.event.source.type === "room") {
      return this.searchGroup(this.event.source.roomId);
    } else if (this.user_session.state === "active") {
      return this.searchGroup(this.user_session.groupId);
    } else {
      const idle = require("/app/src/idle");
      return idle.receive(
        this.client,
        this.event,
        this.args,
        this.user_session
      );
    }
  },

  searchGroup: function(groupId) {
    //for maintenance
    if (groupId !== process.env.DEV_GROUP) {
      //return this.maintenanceRespond();
    }

    try {
      let groupData = fs.readFileSync(
        "/app/data/groups/" + groupId + "_group.json"
      );
      return this.searchGroupCallback(groupData);
    } catch (err) {
      let newGroup = {
        groupId: groupId,
        state: "idle",
        time_default: 0,
        players: [],
        stats: {
          gamePlayed: 0
        },
        status: "active"
      };
      let groupData = JSON.stringify(newGroup, null, 2);
      return this.searchGroupCallback(groupData);
    }
  },
  
  searchGroupCallback: function(groupData) {
    this.group_session = JSON.parse(groupData);
    
    return this.searchTime(this.group_session.groupId);
  },
  
  searchTime: function(groupId) {
    try {
      let timerData = fs.readFileSync(
        "/app/data/timer/" + groupId + "_timer.json"
      );
      return this.searchTimeCallback(timerData);
    } catch (err) {
      let newTimer = {
        time: 0,
        groupId: groupId
      };
      let timerData = JSON.stringify(newTimer, null, 2);
      return this.searchTimeCallback(timerData);
    }
  },
  
  searchTimeCallback: function(timerData) {
    this.time_session = JSON.parse(timerData);
    
    if (this.user_session.name === "") {
      this.client
        .getProfile(this.user_session.id)
        .then(profile => {
          this.user_session.name = profile.displayName;
          return this.saveUserDataInitial(this.user_session);
        })
        .catch(err => {
          console.log("err di searchTimeCallback func di data.js")
          console.log(JSON.stringify(err, null, 2));
          this.client
            .getGroupMemberProfile(
              this.event.source.groupId,
              this.user_session.id
            )
            .then(u => {
              return this.replyText(
                "💡 " +
                  u.displayName +
                  " gagal bergabung kedalam game, add dulu botnya\nline://ti/p/@134gjxgf"
              );
            });
        });
    } else {
      return this.saveUserDataInitial(this.user_session);
    }
  },

  saveUserDataInitial: function(user_session) {
    fs.writeFileSync(
      "/app/data/users/" + user_session.id + "_user.json",
      JSON.stringify(user_session, null, 2)
    );
    return this.forwardProcess();
  },

  forwardProcess: function() {
    if (this.event.source.type === "user") {
      const personal = require("/app/src/personal");
      return personal.receive(
        this.client,
        this.event,
        this.args,
        this.user_session,
        this.group_session,
        this.time_session
      );
    } else {
      const werewolf = require("/app/src/werewolf");
      return werewolf.receive(
        this.client,
        this.event,
        this.args,
        this.user_session,
        this.group_session,
        this.time_session
      );
    }
  },

  /** message func **/

  maintenanceRespond: function() {
    let groupId = "";

    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    this.client
      .getGroupMemberProfile(groupId, this.event.source.userId)
      .then(profile => {
        return this.client.replyMessage(this.event.replyToken, {
          type: "text",
          text:
            "👋 Sorry " + profile.displayName + ", botnya sedang maintenance."
        });
      })
      .catch(err => {
        // error handling
        console.log("ada error di maintenanceRespond func");
        console.log(this.event);
      });
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  /** save data func **/

  saveUserData: function(user_session) {
    let path = "/app/data/users/" + user_session.id + "_user.json";
    let data = JSON.stringify(user_session, null, 2);
    fs.writeFileSync(path, data);
  },

  saveGroupData: function(group_session) {
    let path = "/app/data/groups/" + group_session.groupId + "_group.json";
    let data = JSON.stringify(group_session, null, 2);
    fs.writeFileSync(path, data);
  },
  
  saveTimeData: function(time_session) {
    let path = "/app/data/timer/" + time_session.groupId + "_timer.json";
    let data = JSON.stringify(time_session, null, 2);
    fs.writeFileSync(path, data);
  },

  resetAllPlayers: function(players) {
    players.forEach(item => {
      let reset_player = {
        id: item.id,
        name: item.name,
        state: "inactive",
        groupId: item.groupId
      };
      this.saveUserData(reset_player);
    });
  }
};
