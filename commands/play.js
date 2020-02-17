const { MessageEmbed } = require("discord.js")
const axios = require("axios")

exports.run = async (client, message, args) => {
  // Only try to join the sender's voice channel if they are in one themselves
  if (client.voice.connections.get(message.guild.id)){
    message.reply(`I'm already playing in \`${client.voice.connections.get(message.guild.id).channel.name}\``)
  } else if (message.member.voice.channel) {
    client.getBroadcast(args[0] ? args.join(" ") : "ChickenFM")
    .then(async (broadcast) => {
      axios.get(`https://api.chickenfm.com/api.php?station=${broadcast.station.id}`)
      .then(({data}) => {
        const embed = new MessageEmbed()
          .setColor(3447003)
          .setAuthor(message.member.voice.channel.name)
          .setTitle(`🔊 Now playing:`)
          .setDescription(`🎵 **${data.track.title}** by ${data.track.artist}
📢 **Station**: ${broadcast.station.name}
`)
          .setThumbnail(data.cover_medium)
          .setFooter(data.track.artist)
        message.channel.send(embed)
      })
      const connection = await message.member.voice.channel.join()
      client.setGuildStation(message.guild.id, broadcast.station.id)
      connection.play(broadcast.broadcast)
    })
    .catch(e => {
      message.reply(`No station found with the name \`${args.join(' ')}\``)
    })

  } else {
    message.reply('You need to join a voice channel first!');
  }
}

exports.info = {
  name: `play`,
  aliases: ['p'],
  description: `Play ChickenFM in the users current voice channel.`,
  usage: `play *or* p`
}