exports.run = (client, message, args) => {
    if(!args[0]){
      message.reply("you need to mention something to request!");
      return;
    }
     const requestData = args.join(" ");
     const requestMsg = requestData.replace('c!request', '');
     const sendBy = message.author.username
     client.channels.get(client.config.requestchannel).send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },

            title: "New request:",
            description: "",
            fields: [{
                name: "By",
                value: sendBy
              },
              {
                name: "Request:",
                value: requestMsg
              }

            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL
            }
          }
        })
       message.channel.send({embed:{
         color: 46608,
            author: {
            },
      title: "Yay!",
      description: "Request successfully submitted!"
      }
   })

}
