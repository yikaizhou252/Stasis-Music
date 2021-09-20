const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const ytSearch = require('yt-search');

const client = new Discord.Client();

const token = 'ODg3MzY4OTkwNDAwMzQ0MDY1.YUDIxQ.e0FTVuHaohX8I15CJgqZIkkkbnw';
const PREFIX = '!'


var servers = {};


bot.on('ready', () => {

    console.log('Stasis is online');

})

bot.on('message', msg=>{
    if(msg.content === "yo stasis"){
        msg.reply("CHINA #1; JAPAN KOREA BAD");
    }

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){ //the command right after !
        case 'ping':
            msg.channel.sendMessage('chigga!');
            break;

        case 'play':

            function play(connection, msg){

                var server = servers[msg.guild.id];
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filer: "audioonly"}));
                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, msg);
                    } else {
                        connection.disconnect();
                    }
                })
            }

            if(!args[1]){
                msg.channel.sendMessage("please provide a link!");
                return;
            }
            
            if(!msg.member.voiceChannel){ //if user is in a voice channel
                msg.channel.sendMessage("You must be in a voice channel to use Stasis!");
                return;
            }

            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }
            
            var server = servers[msg.guild.id];
            server.queue.push(args[1]);

            if(msg.guild.voiceConnection){
                msg.channel.sendMessage("Stasis is currently playing elsewhere!");
                return;
            }

            msg.member.voiceChannel.join().then(connection => {

                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = videoFinder(args.join(' '));

                if(video){

                    const stream = ytdl(video.url, {filter: 'audioonly'});
                    connection.playStream(stream, {seek: 0, volume: 1})

                }
            });

            
            break;

        case 'skip':
            var server = servers[msg.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;

        case 'stop':
            var server = servers[msg.guild.id];
            if(msg.guild.voiceConnection){
                for(var i = server.queue.length - 1; i >= 0; i--){
                    server.queue.splice(i,1);
                }

                server.dispatcher.end();
                console.log("stopped the queue");

            }

            if(msg.guild.connection) msg.guild.voiceConnection.disconnect();
        break;



    }
})
bot.login(token);