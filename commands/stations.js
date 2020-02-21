const { MessageEmbed } = require("discord.js")

exports.run = async (client, message, args) => {
    const settings = await client.getGuild(message.guild)
    const map = client.stations.map((a, i) => {
        return `**${i+1}**. **${a.name}**: ${a.description}`
    })
    const embed = new MessageEmbed()
    .setTitle("ChickenFM stations")
    .setColor(3447003)
    .setDescription(`${map.join('\n')}\n\n🔊 Play a station with \`${settings.prefix[0]}play [name]\``)

    message.channel.send(embed)
}

exports.info = {
    name: `stations`,
    aliases: [],
    description: `Displays all stations`,
    usage: ``,
    station: false
}