module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    if (!this.args[1]) {
      let roles = [
        "Seer",
        "Werewolf",
        "Doctor",
        "Cultist",
        "Anti-Cult",
        "Werewolf-Cub"
      ];

      flex_text.header.text = "🐺 Role List 🔮";
      flex_text.body.text = roles.join(", ");
      flex_text.body.text +=
        "\n\n" +
        "Cth: '/info anti-cult' untuk mengetahui detail role Anti-Cult";
      return this.replyFlex(flex_text);
    }

    switch (this.args[1]) {
      case "seer":
        flex_text.header.text = "🔮 Seer";
        flex_text.body.text =
          "Warga yang bisa mengecek role asli dari suatu player pada malam hari";
        return this.replyFlex(flex_text);

      case "doctor":
        flex_text.header.text = "💉 Doctor";
        flex_text.body.text =
          "Warga yang bisa memilih siapa yang ingin dilindungi";
        return this.replyFlex(flex_text);

      case "werewolf":
        flex_text.header.text = "🐺 Werewolf";
        flex_text.body.text =
          "Penjahat yang menyerupai manusia pada siang hari. Misinya adalah membunuh semua warga";
        return this.replyFlex(flex_text);

      case "cultist":
        flex_text.header.text = "🤵 Cultist";
        flex_text.body.text =
          "Suatu sekumpulan orang yang bisa menghasut warga menjadi pengikutnya. ";
        flex_text.body.text +=
          "Misinya adalah menggantung Werewolf dan Warga yang menentangnya";
        return this.replyFlex(flex_text);

      case "anti-cult":
        flex_text.header.text = "🚬 Anti-Cult";
        flex_text.body.text =
          "Warga yang membenci anggota Cultist. Jika Cultist ke rumahnya, akan di bunuh.";
        return this.replyFlex(flex_text);

      case "werewolf-cub":
        flex_text.header.text = "🐕 Werewolf-Cub";
        flex_text.body.text =
          "Di Pihak werewolf, namun belum bisa gigit manusia sampai semua Werewolf mati";
        return this.replyFlex(flex_text);

      default:
        let text =
          "💡 Tidak ada ditemukan role " + this.args[1] + " pada role list. ";
        text += "Cek daftar role yang ada dengan cmd '/info'";
        return this.replyText(text);
    }
  },

  /** message func **/

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

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
  }
};
