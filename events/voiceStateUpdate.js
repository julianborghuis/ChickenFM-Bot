module.exports = async (client, oldState, newState) => {
    //if(newState)
    try {
        const guild = await client.getGuild(newState.guild)
        if(guild && guild.autoJoinChannel){
            const fetchedGuild = client.guilds.resolve(guild.guildID).channels
            const channel = fetchedGuild.resolve(guild.autoJoinChannel)
            if(channel.members.filter(member => !member.user.bot).size >= 1) {
                client.getBroadcast("ChickenFM").then(async broadcast => {
                    const connection = await channel.join()
                    connection.play(broadcast.broadcast)
                })
            } else {
                channel.leave()
            }
        }
    } catch(e) {
        console.error(e)
    }
}