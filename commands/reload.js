const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.run = async (client, message, args) => {
    if(!args || args.length < 1) {
        await exec("git pull")
        message.channel.send("Git pulled!")
        return;
    }
    const commandName = args[0];
    // Check if the command exists and is valid
    if(!client.commands.has(commandName)) {
      return message.reply("That command does not exist");
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`The command \`${commandName}\` has been reloaded`);
};

exports.info = {
    name: `reload`,
    aliases: ['rl'],
    description: `Reloads the command`,
    usage: `reload <new prefix>`,
    station: false
}