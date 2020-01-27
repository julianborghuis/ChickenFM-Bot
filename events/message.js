module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) {
    message.reply("That command doesn't exist!");
    return;
  };
  // If its a DM respond with a messages
  if (message.channel.type === 'dm') {
    return message.channel.send("Please join a server to use me \nJoin the ChickenFM Discord server here: https://l.chickenfm.com/discord");
  }

  // Run the command
  cmd.run(client, message, args);
};
