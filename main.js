const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const axios = require("axios")
const DBL = require("dblapi.js");

const client = new Discord.Client();
const config = require("./config.json");

let dbl;
try {
  dbl = new DBL(config.DBLApiKey, client)
  .catch(e => e)
} catch (e) {}
client.dbl = dbl;

// Set the config
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

client.on("voiceStateUpdate", async function(oldState, newState){
  let newMember = newState.member
  let oldMember = oldState.member
  let newUserChannel = newState.channel
  let oldUserChannel = oldState.channel

  if(!oldUserChannel&& newUserChannel !== undefined) {
    if(client.autoJoinChannels.has(newMember.voice.channel.id)){
      if(client.voice.connections.get(newMember.guild.id)){
        return;
      }
      //console.log('it worked!')
      const connection = await newUserChannel.join()
      client.getBroadcast().then(bc => {
        connection.play(bc)
      })
    }
  } else if(!newUserChannel){
    if(oldUserChannel.members.filter(member => !member.user.bot).size == 0) {
      oldUserChannel.leave()
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

  client.getBroadcast = async () => {
    return new Promise((resolve, reject) => {
      if(client.voice.connections.size === 0 || !client.broadcast || !client.dispatcher.writable) {
        client.broadcast = client.voice.createBroadcast();
        client.dispatcher = client.broadcast.play("http://78.46.148.53:8000/radio.mp3")
        client.dispatcher.setVolume(0.5)
        client.broadcast.on("unsubscribe", dispatcher => {
          setTimeout(() =>{
            if(client.voice.connections.size == 0){
              try {
                client.dispatcher.end()
              } catch(e) {
                void(e)
              }
            }
          }, 1000)
        })
        client.broadcast.on("subscribe", dispatcher => {
          const embed =  new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Playing in a new server!")
            .setDescription(`I am now playing in \`${dispatcher.player.voiceConnection.channel.name}\` in \`${dispatcher.player.voiceConnection.channel.guild.name}\`.`)
          client.channels.get(client.config.statsChannel).send(embed)
        })
        resolve(client.broadcast)
      } else if(client.broadcast){
        resolve(client.broadcast)
      }
    })
  }



  client.on('ready', () => {
    if(client.dbl) {
      client.dbl.postStats(client.guilds.size);
      setInterval(() => {
        client.dbl.postStats(client.guilds.size);
    }, 1800000);
    }
});
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
