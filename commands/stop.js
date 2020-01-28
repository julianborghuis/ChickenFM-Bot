exports.run = (client, message, args) => {
  const voiceChannel = message.member.voiceChannel
  if (voiceChannel && voiceChannel.id === message.guild.voiceConnection.channel.id) {
    //message.channel.send('I left the channel!')
    voiceChannel.leave()
    message.react("✅");
  } else {
    message.reply('no')
  }
}

exports.info = {
  name: `stop`,
  aliases: ['leave'],
  description: `Stop playing`,
  usage: `stop`
}