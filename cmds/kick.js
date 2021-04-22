const Discord = require ('discord.js');

module.exports.run = async(bot, message, args) => {

    message.delete();
    let kickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!kickedUser) {
        return message.channel.send('L\'utilisateur :' + kickedUser + 'n\'a pas été trouvé')
    }
    let kickReason = args.join(' ').slice(22);
    if(!kickReason) kickReason = 'Aucune raison spécifiée'
    if(!message.member.hasPermission('KICK_MEMBERS')) {
        return message.channel.send('Vous n\'avez pas la permission.')
    }
    if(kickedUser.hasPermission('KICK_MEMBERS')) {
        return message.channel.send('Vous ne pouvez pas kick cet utilisateur car elle a la permmission \`KICK_MEMBERS\`')
    }
    let kickEmbed = new Discord.MessageEmbed()
    .setDescription('Logs')
    .setColor('#ff0000')
    .addField('Membre kick', `${kickedUser} `)
    .addField('Auteur du kick', `${message.author} `)
    .addField('Salon où la commande a été effectuée', message.channel)
    .addField('Raison', kickReason)
    let kickChannel = message.guild.channels.cache.get('ID_LOGS');
    if(!kickChannel) {
        return message.channel.send('Salon \`logs\` introuvable.\nMerci d\'en créer un.')
    }
    message.guild.member(kickedUser).kick(kickReason)
    kickChannel.send(kickEmbed)
}

module.exports.config = {
    name: 'kick'
}