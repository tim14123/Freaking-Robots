const {MessageEmbed} = require("discord.js");

module.exports.run = async(bot, message, args) => {

    message.delete();
    let BannedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!BannedUser) {
        return message.channel.send('L\'utilisateur :' + BannedUser + 'n\'a pas été trouvé')
    }

    let BanReason = args.join(' ').slice(22);
    if(!BanReason) BanReason = 'Aucune raison spécifiée'

    if(!message.member.hasPermission('BAN_MEMBERS')) {
        return message.channel.send('Vous n\'avez pas la permission.')
    }
    if(BannedUser.hasPermission('BAN_MEMBERS')) {
        return message.channel.send('Vous ne pouvez pas ban cet utilisateur car elle a la permmission \`BAN_MEMBERS\`')
    }

    let BanEmbed = new MessageEmbed()
    .setDescription('Logs')
    .setColor('#ff0000')
    .addField('Membre Banni', `${BannedUser} `)
    .addField('Auteur du ban', `${message.author} `)
    .addField('Salon où la commande a été effectuée', message.channel)
    .addField('Raison', BanReason)

    let BanChannel = message.guild.channels.cache.get('ID_LOGS');
    if(!BanChannel) {
        return message.channel.send('Salon \`logs\` introuvable.\nMerci d\'en créer un.')
    }

    message.guild.member(BannedUser).ban({reason: BanReason})
    BanChannel.send(BanEmbed)
}

module.exports.config = {
    name: 'ban'
}