const { MessageEmbed } = require("discord.js")
const axios = require("axios")

exports.run = (client, message, args) => {
    if(!args[0]){
        return;
    }
    const searchQuery = args.join(" ")

    const m = message.channel.send(new MessageEmbed()
      .setDescription(`Searching for \`${searchQuery}\``)
    )

    axios.get("https://radio.chickenfm.com/api/station/1/requests")
        .then(({data}) => {
            const searchResult = data.find(e => e.song.text.toLowerCase().includes(searchQuery.toLowerCase()))
            if(!searchResult){
                m.then(m => {
                    m.edit(new MessageEmbed()
                      .setColor("RED")
                      .setTitle("Song not found!")
                    )
                  })
                return;
            }

            m.then(m => {
                m.edit(new MessageEmbed()
                    .setColor(3447003)
                    .setTitle(searchResult.song.title)
                    .setAuthor(searchResult.song.artist)
                    .setImage(searchResult.song.art)
                    .setDescription(`
${searchResult.song.album ? `**Album**: ${searchResult.song.album}` : ''}
To request, type \`${client.config.prefix[0]}request ${searchResult.song.text}\`
`)
                )
            })
        })
}