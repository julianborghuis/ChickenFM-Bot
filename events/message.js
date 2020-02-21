module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  if (message.channel.type === 'dm') {
    return message.channel.send("Please join a server to use me \nJoin the ChickenFM Discord server here: https://l.chickenfm.com/discord");
  }

  // Ignore messages not starting with the prefix
  const settings = await client.getGuild(message.guild)
  const prefixes = settings.prefix
  let prefix = false;
  for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
  }

  // Ignore messages not starting with the prefix
  if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  const alias = client.commandAliases.get(command)


  if (cmd) {
    try {
      if(!cmd.info.station) {
        cmd.run(client, message, args);
      } else {
        const station = args[0] ? client.findStation(args.join(' ')) : client.getGuildStation(message.guild.id) ? client.getGuildStation(message.guild.id) : client.findStation("ChickenFM")
        if(!station) {
          message.reply("No station found!")
        } else {
          cmd.run(client, message, args, station);
        }
      }
    } catch(e) {
      console.log(e)
    }
  } else if(alias){
    try {
      if(!alias.info.station) {
        alias.run(client, message, args);
      } else {
        const station = args[0] ? client.findStation(args.join(' ')) : client.getGuildStation(message.guild.id) ? client.getGuildStation(message.guild.id) : client.findStation("ChickenFM")
        if(!station) {
          message.reply("No station found!")
        } else {
          alias.run(client, message, args, station);
        }
      }
    } catch(e) {
      console.log(e)
    }
  }
  // If its a DM respond with a messages
  if (message.channel.type === 'dm') {
    return message.channel.send("Please join a server to use me \nJoin the ChickenFM Discord server here: https://l.chickenfm.com/discord");
  }
};