const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const axios = require("axios")
const DBL = require("dblapi.js");
const WebSocket = require('ws');


const client = new Discord.Client();
const config = require("./config.json");

let dbl;
try {
  dbl = new DBL(config.DBLApiKey, client)
  .catch(e => {})
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
      client.getBroadcast("ChickenFM").then(bc => {
        connection.play(bc.broadcast)
      })
    }
  } else if(!newUserChannel){
    if(oldUserChannel.members.filter(member => !member.user.bot).size == 0) {
      oldUserChannel.leave()
    }
  }
});

const initWS = () => {
  for(var i = 0; i < client.stations.length; i++) {
    const channel = client.stations[i]
    const ws = new WebSocket(`wss://radio.chickenfm.com/api/live/nowplaying/${channel.shortcode}`);
  
    ws.on('open', () => {
      console.log(`[WS] ${channel.name} Ready!`)
    });
    
    ws.on('message', data => {
      const jsonData = JSON.parse(data)
      client.apiData[jsonData.station.id] = jsonData
      if(jsonData.station.id == 1){
        client.user.setActivity(`${client.apiData[1].now_playing.song.artist}  - ${client.apiData[1].now_playing.song.title} | ${client.guilds.size} servers | c!help | ChickenFM.com`, { type: 'LISTENING' })
      }
    });
    
    ws.on('close', () => {
      initWS()
    })
  }
}


client.on('ready', () => {
  console.log("[D.JS] Ready!")

  if(client.dbl) {
    client.dbl.postStats(client.guilds.size);
    setInterval(() => {
      client.dbl.postStats(client.guilds.size);
    }, 1800000);
  }
  
  axios.get("https://radio.chickenfm.com/api/stations")
  .then(({data}) => {
    client.stations = data
    client.apiData = {}
    initWS()
  })

  client.broadcasts = {}
  client.dispatchers = {}
  client.guildStations = {}

  client.findStation = (stationName) => {
    const station = client.stations.find(e => e.name.toLowerCase().includes(stationName.toLowerCase()))
    return station ? station : null
  }
  client.getApiData = (stationName) => {
    const station = client.stations.find(e => e.name.toLowerCase().includes(stationName.toLowerCase()))
    return client.apiData[station.id]
  }
  client.setGuildStation = (guildId, stationId) => {
    const station = client.stations.find(e => e.id == stationId)
    client.guildStations[guildId] = station
    return client.guildStations[guildId]
  }
  client.getGuildStation = (guildId) => {
    return client.guildStations[guildId] ? client.guildStations[guildId] : null
  }

  client.getBroadcast = async (stationName) => {
    return new Promise((resolve, reject) => {
      if (!stationName) {
        reject("No station provided")
        return;
      } else if (typeof (stationName) !== "string") {
        reject("Station should be a string")
        return;
      }
      axios.get("https://radio.chickenfm.com/api/stations")
        .then(async ({ data }) => {
          const station = data.find(e => e.name.toLowerCase().includes(stationName.toLowerCase()))
          if (!station) {
            reject("No station found!")
            return;
          }
          if (client.voice.connections.size === 0 || client.broadcasts[station.id].subscribers.length == 0 || !client.broadcasts[station.id] || !client.dispatchers[station.id].writable) {
            client.broadcasts[station.id] = client.voice.createBroadcast();
            client.dispatchers[station.id] = client.broadcasts[station.id].play(station.listen_url)
            client.dispatchers[station.id].setVolume(0.5)

            client.broadcasts[station.id].on("unsubscribe", dispatcher => {
              setTimeout(() => {
                if (client.broadcasts[station.id].subscribers.length == 0) {
                  try {
                    client.dispatchers[station.id].end()
                  } catch (e) {
                    console.log(e)
                  }
                }
              }, 2000)
            })

            client.broadcasts[station.id].on("subscribe", dispatcher => {
              const embed = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle("Playing in a new server!")
                .setDescription(`I am now playing in \`${dispatcher.player.voiceConnection.channel.name}\` in \`${dispatcher.player.voiceConnection.channel.guild.name}\`.`)
              try {
                const channel = client.channels.get(client.config.statsChannel)
                channel.send(embed)
              } catch (e) {

              }
            })
            resolve({ broadcast: client.broadcasts[station.id], station: station })
          } else if (client.broadcasts[station.id]) {
            resolve({ broadcast: client.broadcasts[station.id], station: station })
          }
        })
    })
  }
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
