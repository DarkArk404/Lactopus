const fs = require("fs");
module.exports = {
  client: "",
  event: "",
  args: [],
  group_session: {},
  user_session: {},
  time_session: {},

  receive: function(
    client,
    event,
    args,
    user_session,
    group_session,
    time_session
  ) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;
    this.time_session = time_session;

    switch (this.args[0]) {
      case "/new":
      case "/buat":
      case "/main":
      case "/play":
        return this.newCommand();
      case "/join":
      case "/j":
        return this.joinCommand();
      case "/cancel":
      case "/out":
      case "/quit":
      case "/keluar":
        return this.cancelCommand();
      case "/start":
      case "/mulai":
        return this.startCommand();
      case "/stop":
        return this.stopCommand();
      case "/cmd":
        return this.commandCommand();
      case "/help":
        return this.helpCommand();
      case "/players":
      case "/player":
      case "/pemain":
        return this.playersCommand();
      case "/check":
      case "/cek":
        return this.checkCommand();
      case "/voting":
        return this.votingCommand();
      case "/vote":
        return this.voteCommand();
      case "/about":
        return this.aboutCommand();
      case "/stat":
      case "/stats":
        return this.statCommand();
      case "/info":
      case "/rolelist":
        return this.infoCommand();
      case "/role":
      case "/news":
        return this.personalCommand();
      default:
        return this.invalidCommand();
    }
  },

  personalCommand: function() {
    let text =
      "💡 " +
      this.user_session.name +
      ", perintah " +
      this.args[0] +
      " harusnya digunakan di personal chat bot";
    return this.replyText(text);
  },

  infoCommand: function() {
    const roles = require("/app/message/roles");
    return roles.receive(this.client, this.event, this.args);
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

  statCommand: function() {
    let flex_text = {
      header: {
        text: "🐺 Game Played 🧑‍🌾"
      },
      body: {
        text:
          "Sudah ada " +
          this.group_session.stats.gamePlayed +
          " game yang dimainkan di group ini"
      }
    };
    return this.replyFlex(flex_text);
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

  newCommand: function() {
    if (this.group_session.state !== "idle") {
      if (this.group_session.state === "new") {
        return this.replyText("💡 Sudah ada game yang dibuat di grup ini");
      } else {
        return this.replyText("💡 Game sedang berjalan");
      }
    }

    this.group_session.state = "new";
    // this.group_session.time_default = 75;

    this.group_session.players.length = 0;

    this.group_session.nightCounter = 0;

    this.saveGroupData();

    let flex_text = {
      header: {
        text: "📣 Game Baru"
      },
      body: {
        text: "🎮 Game baru telah dibuat!"
      },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      }
      // table: {
      //   header: {
      //     addon: ""
      //   },
      // }
    };

    return this.replyFlex(flex_text);
  },

  joinCommand: function() {
    if (this.group_session.state !== "new") {
      if (this.group_session.state === "idle") {
        return this.replyText(
          "💡 " +
            this.user_session.name +
            ", belum ada game yang dibuat, ketik '/new'"
        );
      } else {
        return this.replyText(
          "💡 " + this.user_session.name + ", game sedang berjalan"
        );
      }
    }

    if (this.user_session.state === "active") {
      if (this.user_session.groupId === this.group_session.groupId) {
        return this.replyText(
          "💡 " + this.user_session.name + ", kamu sudah bergabung kedalam game"
        );
      } else {
        return this.replyText(
          "💡 " +
            this.user_session.name +
            ", kamu masih berada didalam game grup lain"
        );
      }
    }

    this.user_session.state = "active";
    this.user_session.groupId = this.group_session.groupId;

    let newPlayer = {
      id: this.user_session.id,
      name: this.user_session.name,
      state: this.user_session.state,
      groupId: this.user_session.groupId,
      role: {
        name: "villager",
        description:
          "🧑‍🌾 Kamu adalah warga (luar)biasa, tugasmu itu cari tau siapa werewolf, dan gantungkan werewolfnya"
      },
      status: "alive",
      voting: "pending",
      skill: "pending",
      message: "",
      attacked: false,
      healed: false,
      targetIndex: -1,
      targetVoteName: "-",
      afkCounter: 0,
      visitors: [],
      blocked: false
    };

    this.group_session.players.push(newPlayer);

    this.saveUserData();
    this.saveGroupData();

    let text = "💡 " + this.user_session.name + " berhasil bergabung!";

    if (this.group_session.players.length >= 5) {
      text += "\n" + "📣 Sudah cukup pemain, game bisa dimulai";
    }

    return this.replyText(text);
  },

  playersCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let flex_text = {
      header: {
        text: "🐺 Daftar Pemain 🧑‍🌾"
      },
      // body: {
      //   text: ""
      // },
      table: {
        header: {
          addon: ""
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;
    let players = this.group_session.players;
    players.forEach((item, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3,
            wrap: true
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;

      if (item.status === "death") {
        table_body[index].contents[2].text += "💀";
      } else {
        table_body[index].contents[2].text += "😃";
      }

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    if (this.group_session.state === "new") {
      flex_text.footer = {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      };
    }

    return this.replyFlex(flex_text);
  },

  cancelCommand: function() {
    if (this.group_session.state !== "new") {
      if (this.group_session.state === "idle") {
        return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
      } else {
        return this.replyText(
          "💡 " + this.user_session.name + ", game sedang berjalan"
        );
      }
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu belum join kedalam game"
      );
    }

    this.cutFromArray(this.group_session.players, index);

    let text = "💡 " + this.user_session.name + " telah meninggalkan game";

    this.user_session.state = "inactive";

    if (this.group_session.players.length === 0) {
      this.group_session.state = "idle";
      text += "\n" + "💡 Game di stop karena tidak ada pemain";
    }

    this.saveUserData();
    this.saveGroupData();

    return this.replyText(text);
  },

  stopCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu belum join kedalam game"
      );
    }

    this.group_session.state = "idle";
    this.time_session.time = 0;
    this.resetAllPlayers();

    this.saveGroupData();
    
    this.saveTimeData();

    let text = "💡 Game telah di stop " + this.user_session.name;
    return this.replyText(text);
  },

  startCommand: function() {
    if (this.group_session.state !== "new") {
      if (this.group_session.state === "idle") {
        return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
      } else {
        return this.replyText(
          "💡 " + this.user_session.name + ", game sudah berjalan"
        );
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu belum join kedalam game"
      );
    }

    if (players.length < 5) {
      return this.replyText(
        "💡 Game belum bisa dimulai, minimal memiliki 5 pemain"
      );
    }

    this.group_session.time_default = this.getTimeDefault(players.length);

    this.time_session.time = this.group_session.time_default;
    this.time_session.groupId = this.group_session.groupId;

    this.saveTimeData();

    this.randomRoles();
  },

  randomRoles: function() {
    ///werewolf harus selalu ada

    this.group_session.players = this.shuffleArray(this.group_session.players);
    let players = this.group_session.players;
    let roles = this.getRandomRoleSet(players.length);

    this.group_session.players.forEach((item, index) => {
      if (index <= roles.length - 1) {
        item.role.name = roles[index];
      }
      item.role.description = this.getRoleDescription(item.role.name);
      item.role.team = this.getRoleTeam(item.role.name);
    });

    this.group_session.roles = roles;
    this.group_session.players = this.shuffleArray(this.group_session.players);

    this.night([]);
  },

  night: function(flex_texts) {
    this.group_session.nightCounter++;

    this.group_session.state = "night";

    //special role refresh
    this.group_session.cultistCandidates = [];

    this.group_session.players.forEach((item, index) => {
      if (item.status === "alive") {
        item.targetIndex = -1;
        item.message = "";
        item.attacked = false;
        item.healed = false;
        item.voting = "pending";
        item.skill = "pending";
        item.targetVoteName = "-";
        item.culted = false;
        item.visitors = [];
        item.blocked = false;
      }
    });

    ///BUAT Night announcement!

    if (this.checkExistsRole("werewolf-cub")) {
      if (!this.checkExistsRole("werewolf")) {
        let werewolfCubId = this.getPlayerIdByRole("werewolf-cub");
        let index = this.getPlayerIndexById(werewolfCubId);
        this.group_session.players[index].role.name = "werewolf";
        this.group_session.players[
          index
        ].role.description = this.getRoleDescription("werewolf");
        this.group_session.players[index].role.team = this.getRoleTeam(
          "werewolf"
        );
      }
    }

    this.saveGroupData();

    let announcement = "🛏️ Setiap warga kembali kerumah masing-masing" + "\n";
    announcement +=
      "⏳ Waktu yang diberikan " + this.group_session.time_default + " detik";

    let flex_text = this.getNightStateFlex(announcement);

    flex_texts.push(flex_text);

    this.runTimer();

    return this.replyFlex(flex_texts);
  },

  checkCommand: function() {
    let state = this.group_session.state;
    console.log("state sebelumnya : " + state);
    switch (state) {
      case "night":
        if (this.time_session.time > 0) {
          let text =
            "⏳ Waktu masih tersisa " +
            this.time_session.time +
            " detik" +
            "\n";

          let flex_text = this.getNightStateFlex(text);
          return this.replyFlex(flex_text);
        } else {
          return this.checkSkill();
        }
        break;

      case "day":
        if (this.time_session.time > 0) {
          let flex_text = this.getDayStateFlex();
          return this.replyFlex(flex_text);
        } else {
          return this.votingCommand();
        }
        break;

      case "vote":
        if (this.time_session.time > 0) {
          //munculin button player-player sama kasih tau waktu tersisa berapa detik
          return this.votingCommand();
        } else {
          return this.autoVote();
        }
        break;
    }
  },

  checkSkill: function() {
    let roles = this.group_session.roles;
    let players = this.group_session.players;

    for (let i = 0; i < players.length; i++) {
      for (let u = 0; u < roles.length; u++) {
        if (players[i].role.name === roles[u]) {
          if (players[i].role.name === "werewolf-cub") {
            break;
          }

          if (players[i].skill === "pending") {
            this.autoSkill(i);
            break;
          }
        }
      }
    }

    this.saveGroupData();
    return this.day();
  },

  autoSkill: function(index) {
    this.group_session.players[index].targetIndex = -1;
    this.group_session.players[index].skill = "used";
    this.group_session.players[index].afkCounter++;
  },

  autoVote: function() {
    let players = this.group_session.players;
    let notVote = this.getNotVotePlayers();

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "📣 Penghukuman ditunda";
    let text =
      "💬 Waktu habis dan warga belum menentukan siapa yang akan digantung";

    let flex_text = this.getTableFlex(this.getAlivePlayers(), text, headerText);

    this.group_session.players.forEach(item => {
      if (item.status === "alive" && item.voting === "pending") {
        item.afkCounter++;
      }
    });

    if (notVote.length >= voteNeeded) {
      return this.night([flex_text]);
    } else {
      let candidates = this.group_session.lynchCandidate; //kumpulan target index

      let lynchTarget = this.getMostFrequent(candidates);

      if (lynchTarget.index === undefined) {
        return this.night([flex_text]);
      }

      headerText = "📣 Auto Voting";
      flex_text = this.getTableFlex(this.getAlivePlayers(), null, headerText);

      return this.lynch([flex_text]);
    }
  },

  day: function() {
    ///BUAT MASING" SYSTEM UNTUK DAY FUNC
    this.group_session.state = "day";

    let players = this.group_session.players;

    let allAnnouncement = "";
    let cultistAnnouncement = "";
    // emoji 🐺 💉 🔮 🤵 🚬

    for (let i = 0; i < players.length; i++) {
      if (players[i].skill === "used" && players[i].status === "alive") {
        if (players[i].targetIndex !== -1) {
          let roleName = players[i].role.name;
          let targetIndex = players[i].targetIndex;

          if (roleName === "cultist") {
            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + players[targetIndex].name + "\n\n";

            cultistAnnouncement +=
              "👣 " +
              players[i].name +
              " mengunjungi rumah " +
              players[targetIndex].name +
              "\n\n";

            this.group_session.players[targetIndex].message +=
              "🤵 Kamu didatangi Cultist!" + "\n\n";

            if (players[targetIndex].role.name === "werewolf") {
              this.group_session.players[i].message +=
                "Target kamu ternyata Werewolf!" + "\n\n";

              this.group_session.players[targetIndex].targetIndex = i;
            } else if (players[targetIndex].role.name === "anti-cult") {
              this.group_session.players[i].message +=
                "Target kamu ternyata Anti-Cult!" + "\n\n";

              this.group_session.players[targetIndex].targetIndex = i;
            }

            break;
          }
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].skill === "used" && players[i].status === "alive") {
        if (players[i].targetIndex !== -1) {
          let roleName = players[i].role.name;
          let targetIndex = players[i].targetIndex;

          if (roleName === "anti-cult") {
            //this.group_session.players[i].message += "👣 Kamu ke rumah " + players[targetIndex].name + "\n";

            if (players[targetIndex].role.name === "cultist") {
              this.group_session.players[i].message +=
                "🤵 " +
                players[targetIndex].name +
                " adalah seorang Cultist!" +
                "\n\n";

              this.group_session.players[targetIndex].message +=
                "🚬 Kamu diserang " + roleName + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              break;
            } else {
              this.group_session.players[i].message +=
                "💡 " +
                players[targetIndex].name +
                " bukan seorang Cultist" +
                "\n\n";
            }
          }
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].skill === "used" && players[i].status === "alive") {
        if (players[i].targetIndex !== -1) {
          let roleName = players[i].role.name;
          let targetIndex = players[i].targetIndex;

          if (roleName === "werewolf") {
            this.group_session.players[i].message +=
              "💡 Kamu menyerang " + players[targetIndex].name + "\n\n";
            this.group_session.players[targetIndex].message +=
              "🐺 Kamu diserang " + roleName + "!" + "\n\n";

            this.group_session.players[targetIndex].attacked = true;

            break;
          }
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].skill === "used" && players[i].status === "alive") {
        if (players[i].targetIndex !== -1) {
          let roleName = players[i].role.name;
          let targetIndex = players[i].targetIndex;

          if (roleName === "doctor") {
            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + players[targetIndex].name + "\n\n";

            if (players[targetIndex].attacked === true) {
              this.group_session.players[i].message +=
                "💡 " + players[targetIndex].name + " diserang!" + "\n\n";

              this.group_session.players[targetIndex].healed = true;

              this.group_session.players[targetIndex].message +=
                "💉 " + roleName + " berhasil menyelamatkan nyawamu" + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "💡 " +
                players[targetIndex].name +
                " tidak diserang semalam" +
                "\n\n";
            }
            break;
          }
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (players[i].attacked === true && players[i].healed === false) {
          this.group_session.players[i].status = "death";

          allAnnouncement +=
            "💀 " + players[i].name + " ditemukan tak bernyawa" + "\n\n";

          allAnnouncement +=
            "✉️ Role nya adalah " + players[i].role.name + "\n\n";
        } else if (players[i].afkCounter > 3) {
          this.group_session.players[i].status = "death";

          allAnnouncement +=
            "💀 " + players[i].name + " ditemukan tak bernyawa (AFK)" + "\n";

          allAnnouncement +=
            "✉️ Role nya adalah " + players[i].role.name + "\n\n";
        }
      }
    }

    let cultistCandidates = this.group_session.cultistCandidates;
    if (cultistCandidates.length > 0) {
      let cultTarget = this.getMostFrequent(cultistCandidates);

      if (cultTarget.index === undefined) {
        this.shuffleArray(cultistCandidates);
        cultTarget = {
          index: cultistCandidates[0]
        };
        cultistAnnouncement +=
          "Cultist-cultist memiliki target yang berbeda, sehingga random pilih" +
          "\n";
      }

      cultistAnnouncement +=
        "Target Cultist adalah : " + players[cultTarget.index].name + "\n\n";

      if (
        players[cultTarget.index].role.name !== "anti-cult" &&
        players[cultTarget.index].role.name !== "werewolf" &&
        players[cultTarget.index].role.name !== "werewolf-cub"
      ) {
        this.group_session.players[cultTarget.index].culted = true;
      } else {
        cultistAnnouncement +=
          "💡 " +
          players[cultTarget.index].name +
          " kebal dari serangan!" +
          "\n\n";
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (players[i].culted === true) {
          this.group_session.players[i].role.name = "cultist";
          this.group_session.players[
            i
          ].role.description = this.getRoleDescription("cultist");
          this.group_session.players[i].role.team = this.getRoleTeam("cultist");

          this.group_session.players[i].message +=
            "🤵 " + "Kamu berhasil diubah menjadi Cultist" + "\n\n";

          cultistAnnouncement +=
            "🤵 " + players[i].name + " berhasil menjadi cultist!" + "\n\n";

          break;
        }
      }
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].skill === "used" && players[i].status === "alive") {
        if (players[i].targetIndex !== -1) {
          let roleName = players[i].role.name;
          let targetIndex = players[i].targetIndex;

          if (roleName === "seer") {
            let targetRole = players[targetIndex].role.name;

            this.group_session.players[i].message =
              "🔮 Role " + players[targetIndex].name + " adalah " + targetRole;

            break;
          }
        }
      }
    }

    ///untuk announcement certain role
    this.group_session.players.forEach((item, index) => {
      if (item.role.name === "cultist" && item.status === "alive") {
        item.message += cultistAnnouncement;
      }
    });

    this.saveGroupData();

    if (!allAnnouncement) {
      allAnnouncement += "🛏️ Semalam tidak ada yang mati" + "\n";
    }

    let flex_text = {
      header: {
        text: "⛅ Day"
      },
      body: {
        text: allAnnouncement
      }
      // footer: {
      //   buttons: [
      //     {
      //       action: "uri",
      //       label: "✉️ Cek Hasil Skill",
      //       data: "line://oaMessage/@134gjxgf/?/news"
      //     }
      //   ]
      // }
      // table: {
      //   header: {
      //     addon: ""
      //   },
      //   body: []
      // }
    };

    ///check victory
    let someoneWin = this.checkVictory();

    if (someoneWin) {
      return this.endGame([flex_text], someoneWin);
    } else {
      let timerText =
        "💬 Warga diberi waktu diskusi selama " +
        this.group_session.time_default +
        " detik" +
        "\n";

      timerText += "💀 Siapa yang mau digantung";

      flex_text.body.text += timerText;

      flex_text.body.text +=
        "\n\n" +
        "💡 Pengguna Skill jangan lupa gunakan commands '/news' di pc bot";

      flex_text.footer = {
        buttons: [
          {
            action: "uri",
            label: "✉️ News",
            data: "line://oaMessage/@134gjxgf/?/news"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/voting"
          }
        ]
      };

      this.runTimer();

      return this.replyFlex([flex_text]);
    }
  },

  votingCommand: function() {
    if (this.group_session.state !== "day") {
      if (this.group_session.state === "idle") {
        return this.replyText(
          "💡 " +
            this.user_session.name +
            ", belum ada game yang dibuat, ketik '/new'"
        );
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu belum join kedalam game"
      );
    }

    if (this.group_session.state === "day") {
      if (this.time_session.time > 0) {
        let text =
          "💡 " + this.user_session.name + ", belum saatnya voting" + "\n";
        text +=
          "⏳ Sisa waktu " +
          this.time_session.time +
          " detik lagi untuk voting" + "\n";
        text += "Ketik '/voting' untuk lanjutkan proses voting setelah waktu habis";
        return this.replyText(text);
      }

      this.group_session.state = "vote";
      this.group_session.lynchCandidate = []; //indexnya target;

      this.saveGroupData();

      this.runTimer();
    }

    let text = "⏳ Waktu yang diberikan " + this.time_session.time + " detik";

    let flex_text = {
      header: {
        text: "📣 Voting"
      },
      body: {
        text: "💀 Pilih siapa yang mau digantung" + "\n" + text
      },
      // table: {
      //   header: {
      //     addon: ""
      //   },
      //   body: []
      // }
      footer: {
        buttons: [
          // {
          //   action: "postback",
          //   label: "masook",
          //   data: "/join"
          // }
        ]
      }
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "alive") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: "/vote " + item.id
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });

    return this.replyFlex(flex_text);
  },

  voteCommand: function() {
    if (this.group_session.state !== "vote") {
      if (this.group_session.state === "idle") {
        return this.replyText(
          "💡 " +
            this.user_session.name +
            ", belum ada game yang dibuat, ketik '/new'"
        );
      } else {
        return this.replyText(
          "💡 " + this.user_session.name + ", belum saatnya voting"
        );
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu belum join kedalam game"
      );
    }

    if (players[index].status !== "alive") {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu sudah mati"
      );
    }

    if (players[index].voting === "done") {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu sudah voting"
      );
    }
    
    if (! this.args[1]){
      return this.votingCommand();
    }

    let targetIndex = this.getPlayerIndexById(this.args[1]);

    if (parseInt(targetIndex) === parseInt(index)) {
      return this.replyText(
        "💡 " + this.user_session.name + ", gak bisa vote diri sendiri"
      );
    }

    this.group_session.players[index].voting = "done";

    this.group_session.players[index].targetVoteName =
      players[targetIndex].name;

    this.group_session.lynchCandidate.push(parseInt(targetIndex));

    let notVote = this.getNotVotePlayers();

    let text =
      "☝️ " + this.user_session.name + " vote " + players[targetIndex].name;

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "📣 Voting";

    if (notVote.length > 0) {
      let opt_button = {
        action: "postback",
        label: "💡 Check",
        data: "/check"
      };
      let flex_text = this.getTableFlex(notVote, text, headerText, [
        opt_button
      ]);
      this.saveGroupData();
      return this.replyFlex(flex_text);
    } else {
      let flex_text = this.getTableFlex(
        this.getAlivePlayers(),
        text,
        headerText
      );
      return this.lynch([flex_text]);
    }
  },

  lynch: function(flex_texts) {
    let players = this.group_session.players;
    let lynchTarget = {};

    let candidates = this.group_session.lynchCandidate; //kumpulan target index

    lynchTarget = this.getMostFrequent(candidates);

    this.group_session.players[lynchTarget.index].status = "death";

    let announcement =
      "💀 Warga memutuskan membunuh " +
      players[lynchTarget.index].name +
      " dengan vote berjumlah " +
      lynchTarget.count +
      " vote";

    announcement +=
      "\n\n" +
      "✉️ Role nya adalah " +
      players[lynchTarget.index].role.name +
      "\n";

    if (!flex_texts[0].body) {
      flex_texts[0].body = {
        text: announcement
      };
    } else {
      flex_texts[0].body.text += "\n" + announcement;
    }

    ///check victory
    let someoneWin = this.checkVictory();

    if (someoneWin) {
      return this.endGame(flex_texts, someoneWin);
    } else {
      return this.night(flex_texts);
    }
  },

  endGame: function(flex_texts, whoWin) {
    console.log("whoWin: " + whoWin);
    let players = this.group_session.players;

    let flex_text = {
      header: {
        text: "🎉 " + whoWin.toUpperCase() + " win! 🎉"
      },
      // body: {
      //   text: text
      // },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "main lagii",
            data: "/new"
          }
        ]
      },
      table: {
        header: {
          addon: "Role"
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;
    players.forEach((item, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3,
            wrap: true
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center",
            wrap: true
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;

      if (item.status === "death") {
        table_body[index].contents[2].text += "💀";
      } else {
        table_body[index].contents[2].text += "😃";
      }

      table_body[index].contents[3].text += item.role.name;
      num++;

      flex_text.table.body.push(table_body[index]);
    });

    this.group_session.stats.gamePlayed++;

    this.group_session.state = "idle";

    this.resetAllPlayers();

    this.saveGroupData();

    flex_texts.push(flex_text);
    return this.replyFlex(flex_texts);
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/new : main game",
      "/cancel : keluar game",
      "/join : join game",
      "/players : cek list pemain",
      "/check : cek pemain pending, dan lanjutkan proses game jika ada yang afk",
      "/voting : untuk lanjut ke proses voting",
      "/stop : stop game",
      "/start : start game",
      "/stat : cek jumlah game yang telah dimainkan di group",
      "/info : tampilin list role",
      "/about : tentang bot"
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
    const invalid = require("/app/message/invalid");
    let response = this.random(invalid);
    return this.replyText(response.text);
  },

  /** helper func **/

  getRandomRoleSet: function(playersLength) {
    let neededRoles = "";
    let roles = [];
    if (playersLength > 5) {
      if (playersLength > 8) {
        if (playersLength > 10) {
        } else {
          /// players.length = 9 - 10
          neededRoles = "6";
        }
      } else {
        /// players.length = 6 - 8
        neededRoles = "5";
      }
    } else {
      //players.length = 5;
      neededRoles = "4";
    }

    let roleSet = require("/app/roles/roleSet");
    roles = this.random(roleSet[neededRoles]);
    roles = this.shuffleArray(roles);
    return roles;
  },

  getTimeDefault: function(playersLength) {
    let time = 0;
    if (playersLength > 5) {
      if (playersLength > 8) {
        if (playersLength > 10) {
        } else {
          /// players.length = 9 - 10
          time = 90;
        }
      } else {
        /// players.length = 6 - 8
        time = 75;
      }
    } else {
      //players.length = 5;
      time = 60;
    }

    return time;
  },

  getPendingCount: function() {
    let count = 0;
    let roles = this.group_session.roles;
    let players = this.group_session.players;

    for (let i = 0; i < players.length; i++) {
      for (let u = 0; u < roles.length; u++) {
        if (players[i].role.name === roles[u]) {
          if (players[i].status === "alive" && players[i].skill === "pending") {
            count++;
          }
        }
      }
    }

    return count;
  },

  getNightStateFlex: function(text) {
    //tell available role
    let roleList = "📣 Role yang ada di game ini : ";
    roleList += this.group_session.roles.join(", ");

    let importantNote =
      "\n\n" +
      "💡 Jangan lupa ketik '/role' di pc bot untuk menggunakan skill" +
      "\n";

    // let announcement = "🛏️ Setiap warga kembali kerumah masing-masing";

    //set flex
    let flex_text = {
      header: {
        text: "🌙 Malam - " + this.group_session.nightCounter
      },
      body: {
        text: roleList + importantNote
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "💡 Role",
            data: "line://oaMessage/@134gjxgf/?/role"
          },
          {
            action: "postback",
            label: "💡 Check",
            data: "/check"
          }
        ]
      }
      // table: {
      //   header: {
      //     addon: ""
      //   },
      // }
    };

    if (text) {
      flex_text.body.text += "\n" + text;
    }

    return flex_text;
  },

  getDayStateFlex: function() {
    let timerText =
      "💬 Sisa waktu untuk warga diskusi sisa " +
      this.time_session.time +
      " detik lagi" +
      "\n";

    let flex_text = {
      header: {
        text: "☀️ Day"
      },
      body: {
        text: timerText
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "✉️ Cek berita",
            data: "line://oaMessage/@134gjxgf/?/news"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/voting"
          }
        ]
      }
      // table: {
      //   header: {
      //     addon: ""
      //   },
      //   body: []
      // }
    };
    return flex_text;
  },

  checkVictory: function() {
    let someoneWin = "";
    let players = this.group_session.players;
    let villagerCount = 0;
    let werewolfCount = 0;
    let cultistCount = 0;

    players.forEach(item => {
      if (item.status === "alive") {
        if (item.role.team === "werewolf") {
          werewolfCount++;
        } else if (item.role.team === "cultist") {
          cultistCount++;
        } else {
          villagerCount++;
        }
      }
    });

    if (
      werewolfCount > 0 &&
      villagerCount === werewolfCount &&
      cultistCount === 0
    ) {
      someoneWin = "🐺 werewolf";
    }

    if (
      werewolfCount > 0 &&
      cultistCount === werewolfCount &&
      villagerCount === 0
    ) {
      someoneWin = "🐺 werewolf";
    }

    if (werewolfCount > 0 && villagerCount === 0 && cultistCount === 0) {
      someoneWin = "🐺 werewolf";
    }

    if (villagerCount > 0 && werewolfCount === 0 && cultistCount === 0) {
      someoneWin = "🧑‍🌾 villager";
    }

    if (cultistCount > 0 && werewolfCount === 0 && villagerCount === 1) {
      someoneWin = "🤵 cultist";
    }

    if (cultistCount > 0 && villagerCount === 0 && werewolfCount === 0) {
      someoneWin = "🤵 cultist";
    }

    return someoneWin;
  },

  getNamesByTeam: function(teamName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.role.team === teamName) {
        names.push(item.name);
      }
    });
    return names.join(", ");
  },

  getRoleDescription: function(roleName) {
    const roles = require("/app/message/roleInfo");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].description;
      }
    }
  },

  getRoleTeam: function(roleName) {
    const roles = require("/app/message/roleInfo");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].team;
      }
    }
  },

  getTableFlex: function(players, text, headerText, opt_buttons) {
    let flex_text = {
      header: {
        text: headerText
      }
      // body: {
      //   text: ""
      // }
    };

    if (text) {
      flex_text.body = {
        text: text + "\n"
      };
    }

    if (opt_buttons) {
      flex_text.footer = {
        buttons: []
      };
      opt_buttons.forEach((item, index) => {
        flex_text.footer.buttons.push(item);
      });
    }

    flex_text.table = {
      header: {
        addon: "Vote"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    players.forEach((voter, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3
          },
          {
            type: "text",
            text: "",
            flex: 2
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center",
            wrap: true
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += voter.name;
      table_body[index].contents[2].text += voter.voting;
      table_body[index].contents[3].text += voter.targetVoteName;

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  getNotVotePlayers: function() {
    let notVote = [];

    this.group_session.players.forEach(item => {
      if (item.status === "alive" && item.voting === "pending") {
        notVote.push(item);
      }
    });

    return notVote;
  },

  getAlivePlayers: function() {
    let alivePlayers = [];

    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        alivePlayers.push(item);
      }
    });

    return alivePlayers;
  },

  getAlivePlayersCount: function() {
    let count = 0;
    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        count++;
      }
    });
    return count;
  },

  checkExistsRole: function(roleName) {
    let found = false;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (
        this.group_session.players[i].role.name === roleName &&
        this.group_session.players[i].status === "alive"
      ) {
        found = true;
        return found;
      }
    }
    return found;
  },

  getPlayerIdByRole: function(roleName) {
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].role.name === roleName) {
        return this.group_session.players[i].id;
      }
    }
  },

  getPlayerIndexById: function(id) {
    let targetIndex = -1;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (id === this.group_session.players[i].id) {
        targetIndex = i;
        return targetIndex;
      }
    }
    return targetIndex;
  },

  getMostFrequent: function(array) {
    ///source : https://stackoverflow.com/questions/31227687/find-the-most-frequent-item-of-an-array-not-just-strings
    let mf = 1; //default maximum frequency
    let m = 0; //counter
    let item; //to store item with maximum frequency
    let player = {}; //playerObject
    for (
      let i = 0;
      i < array.length;
      i++ //select element (current element)
    ) {
      for (
        let j = i;
        j < array.length;
        j++ //loop through next elements in array to compare calculate frequency of current element
      ) {
        if (array[i] == array[j])
          //see if element occurs again in the array
          m++; //increment counter if it does
        if (mf < m) {
          //compare current items frequency with maximum frequency
          mf = m; //if m>mf store m in mf for upcoming elements
          item = array[i]; // store the current element.
        }
      }
      m = 0; // make counter 0 for next element.
    }

    //jika ada yang sama, maka akan pilih yang di pertama kali diisi di variable 'item'
    player = {
      index: item,
      count: mf
    };

    return player;
  },

  cutFromArray: function(array, index) {
    for (var i = index; i < array.length - 1; i++) {
      array[i] = array[parseInt(i) + 1];
    }
    array.pop();
    return array;
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

  shuffleArray: function(o) {
    for (
      var j, x, i = o.length;
      i;
      j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
    );
    return o;
  },

  random: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  runTimer: function() {
    ///terkadang gak yakin clearInterval
    ///benar" clear sesuai timerId
    if (this.time_session.time !== 0) {
      clearInterval(this.timerId);
    }

    this.time_session.time = this.group_session.time_default;

    var timerId = setInterval(() => {
      if (this.time_session.time < 1) {
        clearInterval(this.timerId);
      } else {
        this.time_session.time--;
      }
      this.saveTimeData();
    }, 1000);
    this.timerId = timerId;
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

    if (
      this.group_session.state === "idle" ||
      this.group_session.state === "new"
    ) {
      /// need func for this
      let oldName = this.user_session.name;
      let isNameDifferent = this.client
        .getProfile(this.user_session.id)
          .then(p => {
            let text = "";
            if (p.displayName !== this.user_session.name) {
              text +=
                "💡 " +
                p.displayName +
                ", nama kamu tidak update dengan session sekarang. ";
              text += oldName + " adalah nama lamamu. ";
              text += "Gunakan command '/update' di pc bot untuk update nama";
            }
            return text;
          })
          .catch((err) => {
            /* 
            ini untuk yang uda ada session, cuman dia block botnya,
            jadi ga bisa di check oleh getProfile
            */
            return this.client.replyMessage(
              this.event.replyToken,
              texts.map(text => ({ type: "text", text }))
             );
          })
      
      isNameDifferent.then(infoText => {
        /*
        isNameDifferent nerima apa aja
        */
        
        //ini hax untuk biar ga duplicate replyMessagenya
        if (typeof infoText === "object"){
          return Promise.resolve(null);
        }
        
        if (infoText) {
          texts.push(infoText);
        }
        
        //untuk replyMessage biasa
        return this.client.replyMessage(
          this.event.replyToken,
          texts.map(text => ({ type: "text", text }))
        );
      });
    } else {
      //ini pas state game nya sudah active,
      //jadi tak cek apa apa
      return this.client.replyMessage(
        this.event.replyToken,
        texts.map(text => ({ type: "text", text }))
      );
    }
  },

  /** save data func **/

  saveGroupData: function() {
    const data = require("/app/src/data");
    data.saveGroupData(this.group_session);
  },

  saveUserData: function() {
    const data = require("/app/src/data");
    data.saveUserData(this.user_session);
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
