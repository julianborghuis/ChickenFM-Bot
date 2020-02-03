const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const axios = require("axios")

const client = new Discord.Client();
const config = require("./config.json");
// Set the prefix
client.config = config;

const autoJoinChannels = new Enmap({
  name: "autoJoinChannels",
  autoFetch: true,
  fetchAll: false
});
//Bind to 'client'
client.autoJoinChannels = autoJoinChannels

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();
client.commandAliases = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);

    if(props.info) {
      if(props.info.aliases){
        for(i = 0; i < props.info.aliases.length; i++){
          client.commandAliases.set(props.info.aliases[i], props)
        }
      }
    }
  });
});

client.on("guildMemberAdd", (member) => {
  if(config.guilds.includes(member.guild.id)){ // only run when user joins my server
    if(member.guild)
    var guild = member.guild; // Reading property `guild` of guildmember object.
    let memberTag = member.user.id; // GuildMembers don't have a tag property, read property user of guildmember to get the user object from it
    if(guild.systemChannel){ // Checking if it's not null
      guild.systemChannel.send("Welcome <@" + memberTag + "> to the server! Listen to ChickenFM in the voicechanel!");
    }
  }
});

client.on("voiceStateUpdate", function(oldMember, newMember){
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel

  if(oldUserChannel === undefined && newUserChannel !== undefined) {
    if(client.autoJoinChannels.has(newMember.voiceChannelID)){
      if(client.voiceConnections.get(newMember.guild.id)){
        return;
      }
       //console.log('it worked!')
       const connection = newMember.voiceChannel.join().then(connection => {
        const dispatcher = connection.playStream('https://radio.chickenfm.com/radio/8000/radio.mp3');
        dispatcher.setVolume(0.5);
        });
    }
  } else if(newUserChannel === undefined){
    if(client.channels.get(oldUserChannel.id).members.filter(member => !member.user.bot).size == 0) {
      client.channels.get(oldUserChannel.id).leave()
    }
  }
});

function ListeningUpdate() {
    axios.get('https://radio.chickenfm.com/api/nowplaying/1')
      .then(r => client.user.setActivity(`${r.data.now_playing.song.artist}  - ${r.data.now_playing.song.title} | ${client.guilds.size} servers | c!help`, { type: 'LISTENING' }) )
}

client.on('ready', () => {
  ListeningUpdate()
  setInterval(ListeningUpdate, 15000)
})

client.convertLength = (millisec) => {
  // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = minutes - (hours * 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }
  // Normally I'd give notes here, but I actually don't understand how this code works.
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}

client.login(config.TOKEN);
