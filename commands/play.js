exports.run = async (client, message, args) => {

  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join()
    connection.play(client.broadcast)
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