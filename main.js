const Discord =  require('discord.js');

const token = 'NOTE: YOU CAN GET YOUR OWN TOKEN ON https://discord.com/developers/applications';
const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //grab all commands files
for(const file of commandFiles){

    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Stasis is actually online');
});

client.on('message', message => {

    // if msg is correct
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping') {
        client.commands.get('ping').execute(message, args);
    } else if (command === 'play') {
        client.commands.get('play').execute(message, args);
    } else if (command === 'leave') {
        client.commands.get('leave').execute(message, args);
    }
})

client.login(token);
