const { ShardingManager } = require('discord.js');
const config = require("./config")
const manager = new ShardingManager('./main.js', { token: config.TOKEN });

manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.spawn('auto');
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));