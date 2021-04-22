const Discord = require ('discord.js')

module.exports.run = async (bot, message, args) => {

    const target = message.mentions.users.first();
    if (target) {
        let mainRole = message.guild.roles.cache.find(role => role.id  === 'ID_ROLE')
        let muteRole = message.guild.roles.cache.find(role => role.id  === 'ID_MUTE')

        let memberTarget = message.guild.members.cache.get(target.id);

        memberTarget.roles.remove(mainRole.id);
        memberTarget.roles.add(muteRole.id);
        message.channel.send(`<@${memberTarget.user.id}> à été rendus mué`);
    } else {
        message.channel.send('Merci de mentionner la personne à mute !')
    }
}

module.exports.config = {
    name: 'mute'
}