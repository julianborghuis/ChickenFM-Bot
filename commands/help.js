const { RichEmbed } = require("discord.js")

exports.run = (client, message, args) => {
    const embed  = new RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle("Commands")
        .setColor(3447003)
        .setDescription(`
        \`autojoin\`: Enables or disables the autojoin feature.
        \`play\` or \`p\`: Plays ChickenFM in the users current channel.
        \`stop\` or \`leave\`: Stops playing.
        \`songs [page number]\`: Displays all available songs.
        \`help\`: Displays this.
        \`nowplaying\` or \`np\`: Displays the current playing track.
        \`request\` or \`r\`: Request a song.
        \`lyrics\` or \`l\`: Displays the lyrics of the current song.

        Remember to use one of these prefixes:  \`${client.config.prefix.join("`, `")}\`
`)
    message.channel.send(embed)
}
