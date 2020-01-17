module.exports = {
  client: "",
  event: "",
  args: [],
  user_session: {},

  receive: function(client, event, args, user_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;

    //return this.replyText("💡 Bot ini belum memiliki sistem auto reply. Pesan anda akan di cek jika admin sedang online");

    switch (this.args[0]) {
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/about":
        return this.aboutCommand();
      case "/info":
      case "/rolelist":
        return this.infoCommand();
      case "/update":
        return this.updateCommand();
      case "/role":
      case "/news":
        return this.notInGameCommand();
      default:
        return this.invalidCommand();
    }
  },
  
  updateCommand: function(){
    let text = "";
    
    this.client.getProfile(this.user_session.id)
      .then((profile) => {
      let oldName = this.user_session.name;
        if (profile.displayName !== this.user_session.name){
          this.user_session.name = profile.displayName;
          this.saveUserData();
          text += "💡 Nama kamu sudah di update!" + "\n";
          text += "Nama lama : " + oldName;
          return this.replyText(text);
        } else {
          text += "💡 Data kamu sudah up to date!";
          return this.replyText(text);
        }
    })
      .catch((err) => {
        console.log("error di updateCommand di idle.js");
        console.log(err);
    })
  },

  notInGameCommand: function() {
    let text = "💡 Kamu tidak ada join kedalam game";
    return this.replyText(text);
  },

  aboutCommand: function() {
    let text = "Bot ini dibuat karna Werewolf Arena belum bisa dipake. ";
    text += "Jadinya aku buat biar bisa main sama temen. ";
    text +=
      "Thanks buat grup Avalon City, Random, LOW, Where Wolf(?) dan semua adders!" +
      "\n";
    text += "- Eriec (creator)";
    let flex_text = {
      header: {
        text: "🐺 Werewolf 🧑‍🌾"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  infoCommand: function() {
    const roles = require("/app/message/roles");
    return roles.receive(this.client, this.event, this.args);
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/help : bantuan game",
      "/about : tentang bot",
      "/info : list role",
      "/update : update data session"
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
