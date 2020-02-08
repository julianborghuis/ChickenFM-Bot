const axios = require("axios")
const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    const m = message.channel.send(new Discord.MessageEmbed()
        .setTitle("Please wait...")
    )

    axios.get("https://radio.chickenfm.com/api/station/1/requests")
        .then(r => {
            const data = r.data
            if(!args[0]){
                sendSongs(data)
            } else if(!args[0].isNaN) {
                sendSongs(data, args * 10)
            }
        })
    function sendSongs(arr, number = false){
        const embed = new Discord.MessageEmbed()
            .setTitle("Songs")
            .setColor(3447003);
        
        if(number)
            number = number - 10

        const map = number ? 
                arr.map((a, i) => { return i < number ? '' : `**${i + 1}**. ${a.song.text}` })
            :
                arr.map((a, i) => { return `**${i + 1}**. ${a.song.text}` })

        map.splice(number ? 10 + number : 10, map.length)

        embed.setDescription(map.join("\n"))
        m.then(m => {
            m.edit(embed)
        })
    }
}
exports.info = {
    name: `songs`,
    aliases: [],
    description: `Displays all the songs`,
    usage: `songs [page number]`
  }