module.exports = {
  receive: function(client, event, args, user_session, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;
    
    let flex_msg = {
      type: "flex",
      altText: "📣 ada pesan untuk kamu",
      contents: {
        type: "carousel",
        contents: [
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F1.png?v=1578041841972",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Buat new game",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "1",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F2.png?v=1578041855869",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Mulai game",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "2",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F3.png?v=1578041888109",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Cek Role",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "3",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F4.png?v=1578042033838",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Cek Role",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "4",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F5.png?v=1578042051282",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Melakukan Skill",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "5",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F6.png?v=1578042063475",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "pakai '/check'",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "6",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F7.png?v=1578042072289",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "pakai '/check' lawan afk",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "7",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F8.png?v=1578042082580",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Cek berita",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "8",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F9.png?v=1578042092760",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "Tekan tombol 'voting!'",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "9",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          },
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://cdn.glitch.com/fd5f6d90-44ad-43e7-8f4f-a33938475a10%2F10.png?v=1578042104973",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "2:3",
                  gravity: "top"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "'/check' proses vote",
                          size: "xl",
                          color: "#ffffff",
                          weight: "bold"
                        }
                      ]
                    }
                  ],
                  position: "absolute",
                  offsetBottom: "0px",
                  offsetStart: "0px",
                  offsetEnd: "0px",
                  backgroundColor: "#03303Acc",
                  paddingAll: "20px",
                  paddingTop: "18px"
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "10",
                      color: "#ffffff",
                      align: "center",
                      size: "xs",
                      offsetTop: "3px"
                    }
                  ],
                  position: "absolute",
                  cornerRadius: "20px",
                  offsetTop: "18px",
                  backgroundColor: "#ff334b",
                  offsetStart: "18px",
                  height: "25px",
                  width: "53px"
                }
              ],
              paddingAll: "0px"
            }
          }
        ]
      }
    };

    return this.client
      .replyMessage(this.event.replyToken, flex_msg)
      .catch(err => {
        console.log(JSON.stringify(flex_msg.contents, null, 2));
      });
  }
};
