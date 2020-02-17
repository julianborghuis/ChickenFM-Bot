const axios = require("axios")
const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    const station = args[0] ? client.findStation(args.join(' ')) : client.getGuildStation(message.guild.id) ? client.getGuildStation(message.guild.id) : client.findStation("ChickenFM")
    axios.get(`https://radio.chickenfm.com/api/station/${station.id}/requests`)
        .then(r => {
            const arr = r.data
            const embed = new Discord.MessageEmbed()
                .setColor(3447003);

            const constructMap = (pageNum) => {
                pageNum = pageNum * 10 - 10

                const map = arr.map((a, i) => {
                    return i < pageNum ? '' : `**${i + 1}**. ${a.song.text}`
                })
                map.splice(pageNum ? 10 + pageNum : 10, map.length)
                return map
            }
            var pageNumber = 1
            const pages = Math.ceil((arr.length) / 10)

            embed.setDescription(constructMap(pageNumber).join("\n")).setTitle(`Songs on ${station.name} - Page ${pageNumber} / ${pages}`)

            m = message.channel.send(embed)
                .then(msg => {
                    msg.react("◀️").then(() => {
                        msg.react("▶️")
                    }).then(() => {
                        msg.react("🗑️")
                    })

                    const filter = (reaction, user) => ["◀️", "▶️", "🗑️"].includes(reaction.emoji.name) && user.id === message.author.id

                    const collector = msg.createReactionCollector(filter, { time: 120000 });

                    collector.on('collect', r => {
                        if(r.emoji.name === "🗑️"){
                            collector.stop()
                            msg.delete()
                        }
                        if(pageNumber + 1 > pages) {
                            return
                        }
                        msg.reactions.resolve(r).users.remove(message.author.id).catch(e => {})
                        if(r.emoji.name === "◀️" && pageNumber !== 1) {
                            pageNumber--
                            msg.edit(embed
                                .setTitle(`Songs on ${station.name} - Page ${pageNumber} / ${pages}`)
                                .setDescription(constructMap(pageNumber).join("\n"))
                            )
                        } else if(r.emoji.name === "▶️") {
                            pageNumber++
                            msg.edit(embed
                                .setTitle(`Songs on ${station.name} - Page ${pageNumber} / ${pages}`)
                                .setDescription(constructMap(pageNumber).join("\n"))
                            )
                        }
                    });

                    //collector.on('end', collected => console.log(`Collected ${collected.size} items`));
                })
        })
}
exports.info = {
    name: `songs`,
    aliases: [],
    description: `Displays all the songs`,
    usage: `songs [page number]`
  }