exports.run = async (client, message, args) => {

  // Only try to join the sender's voice channel if they are in one themselves
  if (client.voice.connections.get(message.guild.id)){
    message.reply(`I'm already playing in \`${client.voice.connections.get(message.guild.id).channel.name}\``)
  } else if (message.member.voice.channel) {
    const broadcast  = client.getBroadcast()
    const connection = await message.member.voice.channel.join()
    broadcast.then(bc => {
      connection.play(bc)
    })
    message.react("✅")
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