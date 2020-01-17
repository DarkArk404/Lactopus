module.exports = {
  client: "",
  event: "",
  args: [],
  group_session: {},
  user_session: {},
  time_session: {},

  receive: function(client, event, args, user_session, group_session, time_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;
    this.time_session = time_session;

    switch (this.args[0]) {
      case "/role":
        return this.roleCommand();
      case "/announce":
      case "/news":
        return this.announceCommand();
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/info":
      case "/rolelist":
        return this.infoCommand();
      case "/bite":
      case "/heal":
      case "/seerCheck":
      case "/cult":
      case "/anticult":
        return this.targetCommand();
      case "/update":
        return this.notIdleCommand();
      default:
        return this.invalidCommand();
    }
  },
  
  notIdleCommand: function(){
    let text = "";
    
    if (this.group_session.state === "new"){
      text += "💡 Perintah " + this.args[0] + " tidak bisa dilakukan, keluar dari room game ";
      text += "untuk melakukan perintah";
    } else {
      text += "💡 Perintah " + this.args[0] + " tidak bisa dilakukan, tunggu game yang berjalan selesai";
    }
    
    return this.replyText(text);
  },

  targetCommand: function() {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
      //return Promise.resolve(null);
    }

    let roleName = players[index].role.name;

    if (players[index].role.name === "villager") {
      return this.replyText("💡 Jangan pernah kau coba untuk");
    }

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (players[index].skill !== "pending") {
      return this.replyText("💡 Kamu sudah menggunakan skill");
    }

    let targetIndex = this.args[1];

    if (parseInt(targetIndex) === parseInt(index)) {
      switch (roleName) {
        case "werewolf":
        case "seer":
        case "cultist":
        case "anti-cult":
          targetIndex = -1;
          break;
      }
    }

    //need system for it
    if (players[index].role.name === "cultist") {
      if (players[targetIndex].role.name === "cultist") {
        return this.replyText(
          "💡 Target yang kamu pilih rolenya adalah Cultist"
        );
      }

      this.group_session.cultistCandidates.push(parseInt(targetIndex));
    }

    //need system for it
    if (players[index].role.name === "werewolf") {
      if (players[targetIndex].role.name === "werewolf-cub") {
        return this.replyText(
          "💡 Target yang kamu pilih rolenya adalah Werewolf-Cub"
        );
      }
    }

    this.group_session.players[index].targetIndex = targetIndex;
    this.group_session.players[index].skill = "used";
    this.saveGroupData();

    let text = "";

    if (targetIndex !== -1) {
      let targetName = players[targetIndex].name;
      text = "📣 Kamu menggunakan skill ke " + targetName;
    } else {
      text = "📣 Kamu memilih tidak menggunakan skill kamu";
    }

    return this.replyText(text);
  },

  roleSkill: function(flex_text, roleName) {
    let skillText = this.getRoleSkillText(roleName);
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText(roleName);

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "alive") {
        button[index] = {
          action: "postback",
          label: item.name,
          // data: cmdText + " " + item.id
          data: cmdText + " " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });

    return this.replyFlex(flex_text);
  },

  roleCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();

    let players = this.group_session.players;
    let state = this.group_session.state;

    let roleName = players[index].role.name;

    let roleDesc = players[index].role.description;

    let flex_text = {
      header: {
        text: roleName.toUpperCase()
      },
      body: {
        text: roleDesc
      }
      // footer: {
      //   buttons: [
      //     {
      //       action: "postback",
      //       label: "cek skill",
      //       data: "/skill"
      //     }
      //   ]
      // }
      // table: {
      //   header: {
      //     addon: ""
      //   },
      // }
    };

    if (
      players[index].role.team === "werewolf" ||
      players[index].role.team === "cultist"
    ) {
      let team = players[index].role.team;
      let nightNews = "\n\n" + "📣 Yang berada di team " + team + " : " + "\n";
      nightNews += this.getNamesByTeam(team) + "\n";
      flex_text.body.text += nightNews;
    }

    if (state !== "day" && state !== "vote") {
      if (
        roleName === "villager" ||
        roleName === "werewolf-cub" ||
        players[index].status === "death"
      ) {
        return this.replyFlex(flex_text);
      } else {
        return this.roleSkill(flex_text, players[index].role.name);
      }
    }

    return this.replyFlex(flex_text);
  },

  announceCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    let message = "🛏️ Kamu tidak diganggu semalam";

    if (players[index].message !== "") {
      message = players[index].message;
    }

    let flex_texts = [
      {
        header: {
          text: "🌙 Berita Malam ke - " + this.group_session.nightCounter
        },
        body: {
          text: message
        }
        // footer: {
        //   buttons: [
        //     // {
        //     //   action: "postback",
        //     //   label: "masook",
        //     //   data: "/join"
        //     // }
        //   ]
        // }
        // table: {
        //   header: {
        //     addon: ""
        //   },
        //  body: []
        // }
      }
    ];

    if (players[index].status === "alive") {
      flex_texts.push({
        header: {
          text: "📣 Info"
        },
        body: {
          text: "☝️ Kembali ke group chat untuk voting"
        }
      });
    }

    return this.replyFlex(flex_texts);
  },

  infoCommand: function() {
    const roles = require("/app/message/roles");
    return roles.receive(this.client, this.event, this.args);
  },

  invalidCommand: function() {
    let text =
      "💡 Perintah yang digunakan salah, ketik '/cmd' untuk list perintah";
    return this.replyText(text);
  },

  helpCommand: function() {
    const helpFlex = require("/app/message/help");
    return helpFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/news : cek berita (malam dibunuh siapa, dll)",
      "/role : cek role",
      "/info : list role",
      "/help : bantuan game"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item;
      if (index !== cmds.length - 1) {
        text += "\n";
      }
    });

    let flex_text = {
      header: {
        text: "📚 Daftar Perintah"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  /** helper func **/

  getNamesByTeam: function(teamName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.role.team === teamName) {
        names.push(item.name);
      }
    });
    return names.join(", ");
  },

  indexOfPlayer: function() {
    let found = -1;
    for (var i in this.group_session.players) {
      if (this.group_session.players[i].id === this.user_session.id) {
        found = i;
      }
    }

    return found;
  },

  getRoleSkillText: function(roleName) {
    const roles = require("/app/message/roleInfo");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].skillText;
      }
    }
  },

  getRoleCmdText: function(roleName) {
    const roles = require("/app/message/roleInfo");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].cmdText;
      }
    }
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

  /** save data func **/

  saveGroupData: function() {
    const data = require("/app/src/data");
    data.saveGroupData(this.group_session);
  },

  saveUserData: function() {
    const data = require("/app/src/data");
    data.saveUserData(this.user_session);
  }
};
