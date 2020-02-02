const { RichEmbed } = require("discord.js")
const axios = require("axios").default

exports.run = (client, message, args) => {
    axios.get("https://radio.chickenfm.com/api/nowplaying/1")
        .then(({data}) => {
            const nowplaying = data.now_playing.song.text
            const nextSong = data.playing_next.song.text
            const songHistory = data.song_history.map((a, i) => {
                return `**${i+1}**. ${a.song.text}`;
            })

            const embed = new RichEmbed()
                .setTitle("Queue for ChickenFM")
                .setColor(3447003)
                .setDescription(`
⏩ **Playing next:**
${nextSong}

🔊 **Now playing:**
${nowplaying}

⏪ **Previously played:**
${songHistory.join("\n")}
`)

            message.channel.send(embed)
        })
}

exports.info = {
    name: `queue`,
    aliases: ['q', 'next', 'history', 'previous'],
    description: `Displays the queue`,
    usage: `queue`
}