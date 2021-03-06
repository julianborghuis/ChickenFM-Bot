const axios = require('axios')
const Discord = require("discord.js")

exports.run = (client, message, args, station) => {
  axios.get(`https://api.chickenfm.com/api.php?station=${station.id}`)
    .then(r => {
      const data = r.data;
      const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle(`Now playing on ${station.name}:`)
        .setDescription(`${data.track.artist} - ${data.track.title}\n[${client.convertLength(data.elapsed * 1000)}/${client.convertLength(data.duration * 1000)}]`)
        .setFooter(`Made by TheChicken`)
        .setColor(3447003)
        .setImage(data.cover_medium)
      message.channel.send(embed)
    })
}

exports.info = {
  name: `nowplaying`,
  aliases: ['np'],
  description: `See what's now playing`,
  usage: `nowplaying *or* np`,
  station: true
}