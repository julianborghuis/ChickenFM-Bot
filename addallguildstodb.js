module.exports = async (client) => {
    client.guilds.cache.array().map(async guild => {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            ownerID: guild.ownerID
        };
    
        try {
            await client.createGuild(newGuild);
        } catch (error) {
            console.error(error);
        }
    })
}