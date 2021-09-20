const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: "Plays music from Youtube",
    async execute(message, args) {

        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('You need to be in a channel to invoke Stasis!');
        const permissions = voiceChannel.permissionsFor(message.client.user);

        if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send("You don't have permission to invoke Stasis");
        if (!args.length) return message.channel.send("What do you want me to play LMAO");

        const connection = await voiceChannel.join();
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null; // we just want the first one


        }

        const video = await videoFinder(args.join(' '));

        if(video) {
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
            });

            await message.reply(`:sunglasses:  Now Playing ***${video.title}***`);

        } else {
            message.channel.send('Cannot find video :(');
        }
    }
}