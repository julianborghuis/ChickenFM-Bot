exports.run = (client, message, args) => {

  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voiceChannel) {
    const connection = message.member.voiceChannel.join().then(connection => {
    const dispatcher = connection.playStream('https://radio.chickenfm.com/radio/8000/radio.mp3?1571408930');
    dispatcher.setVolume(0.5);
    message.react("✅");
    });
  } else {
    message.reply('You need to join a voice channel first!');
  }
}
