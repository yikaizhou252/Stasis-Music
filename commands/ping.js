module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(message, args) {

        // code below
        message.channel.send("you pinged me, little ching chong!");
    }
}