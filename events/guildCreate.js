const Discord = require('discord.js')

module.exports = (client, guild) => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  const embed = new Discord.RichEmbed()
  .setTitle(`🎉 I was added to a new server!`)
  .setColor('GREEN')
  .setDescription(`I was added to ${guild.name}`)
  .addField(`Guild ID`, guild.id)
  .addField(`User count`, guild.memberCount)
  .addField(`My server count`, client.guilds.size)
  if(guild.iconURL) embed.setThumbnail(guild.iconURL);
  client.channels.get(client.config.statsChannel).send(embed)
}
