module.exports = {
  receive: function(
    client,
    event,
    args,
    user_session,
    group_session,
    flex_texts
  ) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;

    this.checkFlex(flex_texts);
  },

  /*
  let flex_text = {
      header: {
        text: "📣 Voting"
      },
      body: {
        text: ""
      }
      // footer: {
      //   buttons: [
      //     {
      //       action: "postback",
      //       label: "bangun tidur",
      //       data: "/awake"
      //     }
      //   ]
      // },
      // table: {
      //   header: {
      //     addon: "Voting"
      //   },
      //   body: []
      // }
    };
  */

  checkFlex: function(flex_texts) {
    //console.log(flex_texts[0]);
    let flex_msg = {
      type: "flex",
      altText: "📣 ada pesan untuk kamu",
      contents: {
        type: "carousel",
        contents: []
      }
    };

    let bubble = {};

    flex_texts.forEach((item, index) => {
      bubble[index] = {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: item.header.text,
              color: "#F6F6F6",
              size: "lg",
              weight: "bold",
              style: "normal",
              decoration: "none",
              align: "center",
              wrap: true
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: []
        },
        styles: {
          header: {
            backgroundColor: "#2d4059"
          },
          footer: {
            separator: false
          }
        }
      };

      if (item.body) {
        bubble[index].body.contents.push({
          type: "text",
          text: item.body.text.trim(),
          wrap: true
        });
      }

      if (item.table) {
        //make table
        let table_header = {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "No. ",
              weight: "bold"
            },
            {
              type: "text",
              text: "Name",
              flex: 3,
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "Status",
              flex: 2,
              weight: "bold",
              align: "center"
            }
          ]
        };

        if (item.table.header.addon !== "") {
          table_header.contents.push({
            type: "text",
            text: item.table.header.addon,
            flex: 2,
            align: "center",
            weight: "bold"
          });
        }

        let separator = {
          type: "separator",
          color: "#40514E",
          margin: "sm"
        };

        bubble[index].body.contents.push(table_header, separator);

        let table_body = item.table.body;

        //iterate data
        table_body.forEach(t => {
          //push to contents
          bubble[index].body.contents.push(t);
        });
      }

      if (item.footer && item.footer.buttons.length > 0) {
        bubble[index].footer = {
          type: "box",
          layout: "vertical",
          contents: [],
          spacing: "md"
        };

        let buttons = item.footer.buttons;

        let opt_button = {};
        let data_button = {};

        let temp = 1;

        for (let i = 0; i < buttons.length; i++) {
          opt_button[i] = {
            type: "box",
            layout: "horizontal",
            contents: [],
            spacing: "md"
          };

          data_button[i] = {
            type: "button",
            action: {},
            style: "primary",
            color: "#2d4059"
          };

          if (buttons[i].action === "postback") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              data: buttons[i].data
            };
          } else if (buttons[i].action === "uri") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              uri: buttons[i].data
            };
          }

          //another magic, need refactor
          opt_button[i].contents.push(data_button[i]);

          if ((parseInt(i) + 1) % 2 === 0) {
            bubble[index].footer.contents[parseInt(i) - temp].contents.push(
              data_button[i]
            );
            temp++;
          } else {
            bubble[index].footer.contents.push(opt_button[i]);
          }
        }
      }

      flex_msg.contents.contents.push(bubble[index]);
    });

    return this.client
      .replyMessage(this.event.replyToken, flex_msg)
      .catch(err => {
        console.log(JSON.stringify(flex_msg.contents, null, 2));
      });
  }
};
