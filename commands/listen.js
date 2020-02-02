const { RichEmbed } = require("discord.js")

exports.run = (client, message, args) => {
    const embed = new RichEmbed()
        .setAuthor("ChickenFM.com", client.user.avatarURL, "https://chickenfm.com")
        .setColor(3447003)
        .setTitle(`Where to listen`)
        .setDescription(`
Listen on the [website](https://chickenfm.com)
Or type \`${client.config.prefix[0]}play\`
`)

    message.channel.send(embed)
}

exports.info = {
    name: `listen`,
    aliases: ['where', 'website'],
    description: `Where to listen?`,
    usage: `listen`
  }