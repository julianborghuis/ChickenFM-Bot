const axios = require("axios").default
const Discord = require("discord.js")

exports.run = (client, message, args) => {
    if(!args[0]){
      message.reply("you need to mention something to request!");
      return;
    }
    
    const request = args.join(" ")

    const m = message.channel.send(new Discord.RichEmbed()
      .setDescription(`Searching for \`${request}\``)
    )
    axios.get("https://radio.chickenfm.com/api/station/1/requests")
      .then(r => {
        const queryData = r.data.find(e => e.song.text.toLowerCase().includes(request.toLowerCase()))
        if(!queryData){
          m.then(m => {
            m.edit(new Discord.RichEmbed()
              .setColor("RED")
              .setTitle("No songs found!")
            )
          })
          return;
        }
        m.then(m => {
          m.edit(new Discord.RichEmbed()
            .setTitle("Song found!")
            .setColor("GREEN")
            .setDescription(`Requesting \`${queryData.song.text}\`...`)
          )
        })
        axios.get(`https://radio.chickenfm.com/api/station/1/request/${queryData.request_id}`, { headers: { 'X-API-Key': client.config.azuracast } })
        .then(r => {
          m.then(m => {
            m.edit(new Discord.RichEmbed()
              .setTitle(`Request \`${queryData.song.text}\``)
              .setDescription(r.data.message)
              .setColor("GREEN")
            )
          })
        }).catch(e => {
          console.log(e.response)
          m.then(m => {
            m.edit(new Discord.RichEmbed()
              .setColor("RED")
              .setTitle(`Request \`${queryData.song.text}\``)
              .setDescription(e.response.data.message)
            )
          })
        })
      })
}
exports.info = {
  name: `request`,
  aliases: ['r'],
  description: `Request a song.`,
  usage: `request <song title>`
}