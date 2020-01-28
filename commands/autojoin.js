const { RichEmbed } = require("discord.js")

exports.run = (client, message, args) => {
    if(!args[0]){
        return message.channel.send(new RichEmbed()
            .setTitle("AutoJoin command")
            .setDescription(`To make ChickenFM automatically join the voice channel, simply join the voice channel you want to link me to and type \`${client.config.prefix[0]}autojoin enable\``)
            .addField(`Permissions needed`, "`MANAGE_CHANNELS`")
        );
    }
    if(args[0] == "enable"){
        if(!message.member.hasPermission('MANAGE_CHANNELS')){
            return message.channel.send(new RichEmbed()
                .setColor("RED")
                .setDescription("You need the `MANAGE_CHANNELS` permission to do this!")
            )
        }
        if(message.member.voiceChannel){
            try {
                client.autoJoinChannels.set(message.member.voiceChannel.id, {autojoin: true})
            } catch(e) {
                return message.channel.send(new RichEmbed()
                    .setColor("RED")
                    .setDescription("An error ocurred!")    
                )
            }
            message.channel.send(new RichEmbed()
                .setColor("GREEN")
                .setDescription(`I will now automatically join \`${message.member.voiceChannel.name}\` when someone joins!`)    
            )
        }
    } else if(args[0] == "disable"){
        if(!message.member.hasPermission('MANAGE_CHANNELS')){
            return message.channel.send(new RichEmbed()
                .setColor("RED")
                .setDescription("You need the `MANAGE_CHANNELS` permission to do this!")
            )
        }
        try {
            client.autoJoinChannels.delete(message.member.voiceChannel.id)
        } catch(e) {
            return message.channel.send(new RichEmbed()
                .setColor("RED")
                .setDescription("An error ocurred!")    
            )
        }
        message.channel.send(new RichEmbed()
        .setColor("GREEN")
        .setDescription(`I will not automatically join \`${message.member.voiceChannel.name}\` anymore!`)    
        )
    }
}

exports.info = {
    name: `autojoin`,
    aliases: [],
    description: `Enables or disables autojoining of a voice channel`,
    usage: `autojoin <enable or disable>`
}