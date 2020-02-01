const axios = require('axios')
const Discord = require("discord.js")

exports.run = (client, message, args) => {
  axios.get(`https://api.chickenfm.com/api.php?station=1`)
    .then(r => {
      const data = r.data;
      const embed = new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle("Now playing:")
        .setDescription(`${data.track.artist} - ${data.track.title}`)
        .setTimestamp()
        .setColor(3447003)
        .setThumbnail(data.cover_xl)
      message.channel.send(embed)
    })
}

exports.info = {
  name: `nowplaying`,
  aliases: ['np'],
  description: `See what's now playing`,
  usage: `nowplaying *or* np`
}