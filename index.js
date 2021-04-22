const Discord = require ('discord.js');
const Menu = require ('discord.js-menu');
const bot = new Discord.Client();
const figlet = require ('figlet');
const moment = require ('moment');
const fs = require ('fs');
const AntiSpam = require ('discord.js-antispam');
const prefix = '*';
const bdd = require ('./bdd.json')


bot.on('ready', async () => {
console.log(`(${bot.user.username}): Je suis connecté`)
    let statuses = [
        `${bot.guilds.cache.size} serveurs`,
        `${bot.guilds.cache.reduce((a, g) => a + g.memberCount,0)} Utilisateurs`,
        `Lana OXF`
    ]
    setInterval(function() {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, { type: "WATCHING" })
    }, 5000)
});
bot.commands = new Discord.Collection();
fs.readdir('./cmds/', (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
        console.log('[HANDLER]: Aucune commande trouver')
    }
    jsfile.forEach((f,i) => {
        let props = require (`./cmds/${f}`);
        console.log(`[✅] [HANDLER]: ${f} ok !`)
        bot.commands.set(props.config.name, props)
    })
})
fs.readdir('./event/', (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
        console.log('[EVENT]: Aucun Event trouver')
    }
    jsfile.forEach((f, i) => {
        let props = require (`./cmds/${f}`)
        console.log(`[⭐] [EVENT]: ${f} ok !`)
        bot.commands.set(props.config.name, props)
    })
});
bot.on('guildMemberAdd', member => {
    member.send(`hey ${member} Bienvenue sur ce magnifique serveur nous t'invitons à lire le règlement et à invité tes pottes via ce lien : https://discord.gg/eMYKETk3PJ`)
    member.roles.add('ID_ROLE_BIENVENUE')
    let embed = new Discord.MessageEmbed()
        .setColor ('#c71cea')
        .setAuthor('Hey Bienvenue  ' + member.user.username + ' nous a rejoint ... !')
        .setDescription(`Voici Son ID : (${member.id})`)
        .setFooter('Nous sommes désormais ' + member.guild.memberCount + ' membres sur le serveur !')
        .setTimestamp()
    member.guild.channels.cache.find(channel => channel.id === 'ID_BIENVENUE').send(embed)
});
bot.on('guildMemberRemove', member => {
    let embed = new Discord.MessageEmbed()
        .setColor ('#c71cea')
        .setAuthor ('Départ')
        .setTitle('» Oh non **' + member.user.username + '** a quitté le discord... !')
        .setDescription(`Voici son ID : (${member.id})`)
        .setFooter('Nous sommes désormais ' + member.guild.memberCount + ' membres sur le serveur !')
        .setTimestamp()
    member.guild.channels.cache.find(channel => channel.id === 'ID_DEPART').send(embed)
});
bot.on('message', async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    let prefix = "*";
    let messagearray = message.content.split(" ")
    let cmd = messagearray[0];
    let args = message.content.trim().split(/ +/g);
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length))
    if (commandfile) commandfile.run(bot, message, args);    
});
bot.on('message', async message => {
    if(message.content.startsWith(prefix + "voc")) {
        message.delete();
        if (message.channel.type == "dm") return
        let size = message.guild.members.cache.filter(m => m.voice.channel).size
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor('Du Monde en Vocal')
        .addField('Nombres de personnes connectés en vocs', `**Actullement : **  **${size}**`)
        .setTimestamp()
        message.channel.send(embed)
    }
    if (message.content.startsWith(prefix +'rules')) {
        message.delete();
        if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send("Vous n'êtes pas autorisé à utiliser cette commande") 

    let channel = message.mentions.channels.first();
    if (!channel || channel.type !== "text")
        return message.reply(`**Veuillez spécifier un channel**`);

    let Embed = new Discord.MessageEmbed()
        .setTitle('Règles du serveur')
        .setColor('#ff0000')
        .setAuthor(message.guild.name)
        .setImage('https://media1.tenor.com/images/e325ed818954aa7369386f7a28347877/tenor.gif?itemid=17106671')

    channel.send(Embed);

    let Embed2 = new Discord.MessageEmbed()
        .setTitle('- Article 1')
        .setDescription("Le respect des GUIDELINES & TERMS de Discord est obligatoire. Selon la gravité de vos actions, nous nous réservons le droit de procéder à un signalement auprès de l’équipe Confiance & Sécurité de Discord.")
        .addField("- Article 2", "Les blagues discriminatoires et discours haineux (attaques contre une personne ou un groupe en fonction de son origine ethnique, de son origine nationale, de son genre, de son orientation sexuelle, de son appartenance religieuse ou de son handicap) sont strictement interdit et feront l’objet de sanction immédiate sans avertissement au préalable. Merci de noter que défendre ou encourager l'un des comportements ci-dessus fera également l'objet de sanction.")
        .addField("- Article 3", "Le contenu pornographique explicite n’a pas sa place au sein de notre serveur discord. Cela comprend des vidéos, des gifs ou des images fixes représentant des actions sexuelles explicites, réelles ou illustrées, ainsi que des descriptions verbales détaillées d’actes sexuels explicites. Tout contenu ou propos faisant allusion à un site non approprié ne fait pas exception à cette règle.")
        .addField("- Article 4", "Votre profil discord doit rester approprié, la présence de caractères non-alphanumériques dans le pseudonyme est à proscrire, la présence d’un « joue à » ou d’un « custom statut » non-approprié est à proscrire (Lien suspicieux, demande d’argents) la présence d’une photo de profil correct est obligatoire.")
        .addField("- Artcile 5", "La publication de lien menant vers d’autres serveur discord est totalement interdite au sein du serveur discord et fera l’objet de sanction immédiate ainsi qu’une suppression de votre message.")
        .addField("- Article 6", "Lorsqu’une action de modération automatique ou non est mise en place, il est interdit d’en discuter en public, si vous souhaitez la contester, veuillez contacter l'adminitration et nous en discuterons avec vous.")
        .addField("- Article 7", "Le spam, flood d’émoticônes / de caractères est à éviter dans vos messages.")
        .addField("- Article 8", "Mentionner de manière abusive ou sans aucune raison valable sur discord les membres de l'administration, l’équipe technique ou l’assistance est strictement interdit.")
        .addField("- Article 9", "Usurper l’identité d’une tierce personne à des fins frauduleuses ou non est strictement interdit et peut engendrer de lourdes sanctions.")
        .addField("- Article 10", "Le respect de chaques personnes présente au sein de notre serveur discord est primordiale. Les insultes ou même toutes formes de harcèlement n’ont pas leur place au sein de notre serveur discord.")
        .setColor('#ff0000')

    channel.send(Embed2);

    let Embed3 = new Discord.MessageEmbed()
        .setTitle('- Article 11')
        .setDescription("Inciter ou partager publiquement un contenu visant à abuser de la confiance de nos utilisateurs est interdit et engendra une sanction immédiate ainsi que la suppression des messages.")
        .addField("- Article 12", "Le « troll » sous n’importe quelle forme est interdit (en vocal comme textuellement).")
        .addField("- Article 13", "L’utilisation des commandes robotiques (Soundbournd).")
        .addField("- Article 14", "Le respect des consignes données par l’équipe de modération est très important. Au bout d’un certains nombre d’avertissement, des sanctions pourraient être mise en place à votre encontre si tel est le cas.")
        .addField("- Article 15", "Toute demande de Rôle que ça soit Modérateur ou autres sera sanctionnable")
        .setColor('#ff0000')

    channel.send(Embed3);

    let Embed4 = new Discord.MessageEmbed()

    .setTitle('⭐')
        .setDescription("Merci de bien vouloir respecter ces conditions sous peines de lourdes sanction , les modérateurs sont a l'affut ! ")
        .setImage("https://media.giphy.com/media/r11U1nHuXciV2yTvEf/giphy.gif")
        .setColor('#ff0000')
    channel.send(Embed4);
    }
});
bot.on('message', async message => {
    if (message.author.bot || message.channel.type == 'dm') return;
    
    if (message.content.startsWith(prefix + 'channelinfo')){
        message.delete();
        let args = message.content.trim().split(/ +/g);
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;
        if (!channel) return message.channel.send("**Channel Non trouvé**");
        let channelembed = new Discord.MessageEmbed()
            .setTitle(`📌 Informations sur ${channel.name}`)
            .setThumbnail(message.guild.iconURL())
            .addField("**📋 Type de channel : **", channel.type)
            .addField("**📝 Channel Description**", `${channel.topic || "Aucune Descrption"}`)
            .addField("**📅 Channel Créer**", `${moment(channel.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`)
            .setColor('#ff0000')
            .setFooter(`๖̶ζ͜͡Freaking Bot `)
        message.channel.send(channelembed);
    }
    if (message.content.startsWith(prefix + 'dm')){
        message.delete();
        let desti = message.mentions.users.first()
        let args = message.content.trim().split(/ +/g);
        const guild = message.guild;
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        if (!desti) return message.channel.send('Veuillez mentionner la personne a dm')
        let messageArray = message.content.split(" ");
        let texte = args.join(" ").slice(22);
        if(!texte) return message.reply("Veuillez indiquer un texte à envoyer")
        const embed = new Discord.MessageEmbed()
        .setColor("#FF000B")
        .setTitle("Attention")
        .setDescription(`**le serveur ${guild.name} vous a contactée**`)
        .addField('\u200B', `**${texte}**`)
        desti.send(embed)
        setTimeout(() => {
        message.guild.leave()
        }, 1000)
    }
    if (message.content.startsWith(prefix + 'suggestions')) {
        message.delete();
        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if (channel) return message.channel.send('Salon suggestions inexistant !');
        let args = message.content.trim().split(/ +/g);
        let MessageArgs = args.join(' ');
        const Zembed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(MessageArgs);
        message.channel.send(Zembed).then((msg) => {
            msg.react('✅');
            msg.react('❌');
            message.delete();
        }).catch((err) => {
            throw err;
        });
    }
    if (message.content.startsWith(prefix + 'menu')){
        message.delete();
        let helpMenu = new Menu(message.channel, message.author.id, [
            {
                name: 'main',
                content: new Discord.MessageEmbed()
                .setTitle('Acceuil')
                .setColor('#ff0000')
                .setDescription('**Bienvenue dans le menu d\'aide**')
                .setFooter('Page 1/3')
                ,
                reactions:{
                '▶': "next"
                }
                },
                {
                name: "otherPage",
                content: new Discord.MessageEmbed()
                .setTitle('Commande')
                .setColor('#ff0000')
                .addField('infouser','info sur un membre')
                .addField('inforole')
                .addField('infoserv','info sur le serveur')
                .addField('channelinfo','pour avoir des infos sur un channel')
                .addField('bot','pour avoir des infos sur le bot')
                .addField('voc','Pour savoir combien de personnes sont en voc')
                .addField('suggestions','pour donner vos idées')
                .setFooter('Page 2/3')
                ,
                reactions:{  
                '◀': 'previous', 
                '▶': "next"
                }
                },
                {
                name: "otherPage",
                content: new Discord.MessageEmbed()
                .setTitle('Admin')
                .setColor('#ff0000')
                .setDescription('**Aucune commande n\'est visible**')
                .setFooter('Page 3/3')
                ,
                reactions:{  
                '◀': 'previous', 
                '▶': "next"
                }
                },
                ], 300000)
                helpMenu.start()
    }
    if (message.content.startsWith(prefix + 'infoserv')) {
        message.delete();
        const guild = message.guild;
        const dembed = new Discord.MessageEmbed()
        .setColor('#C016FF')
        .addField(`Plus d'inoformations à propos de : **${guild}**`,
        `**·📌 Propriétaire:** ${guild.owner.user.tag} 
        **· Roles :**             ${guild.roles.cache.size}
        **· Salons textuels :**   ${guild.channels.cache.filter(ch => ch.type === 'text').size}
        **· Salons vocaux :**     ${guild.channels.cache.filter(ch => ch.type === 'voice').size}
        **· 💻 Membres :** ${guild.memberCount}
        **· 📆 Ce serveur a été créé :**  ${moment(guild.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}
        **· 🌏 Région :**   ${message.guild.region}`
        )
        .setTimestamp()
        message.channel.send(dembed)
    }  
    if (message.content.startsWith(prefix + 'inforole')){
        let args = message.content.trim().split(/ +/g);
        if (!args[0]) return message.channel.send("**Merci de rentrer un rôle!**")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!role) return message.channel.send("**Merci de rentrer un rôle Valide**");
        const status = {
            false: "Non",
            true: "Oui"
        }
        let roleembed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("Role Info")
            .setThumbnail(message.guild.iconURL())
            .addField("**Nom**", role.name, true)
            .addField("**Hex**", role.hexColor)
            .addField("**Membres**", role.members.size)
            .addField("**Position**", role.position)
            .addField("**Mentionable**", status[role.mentionable])
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
        message.channel.send(roleembed);
    } 
    if (message.content.startsWith(prefix + 'infouser')) {
        message.delete();
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        }
        else {
            user = message.author;
        }
        const member = message.guild.member(user);
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor(message.author.tag)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 512}))
        .addField('ID :', message.author.id)
        .addField('A créer son compte le :', `${moment.utc(user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)
        .addField('A rejoint le serveur le :', `${moment.utc(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}`, true)
        .setTimestamp()
        .setFooter(`© 2021`)
        message.channel.send(embed)
    }
    if(message.content.startsWith(prefix + 'ascii')) {
        message.delete();
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        if (!args[0])
        return message.channel.send('Veuillez saisir quelque chose');

        msg = args.join(" ");

        figlet.text(msg, function(err, data) {
        if (err) {
            message.channel.send(' Une erreur s`\'est produite lors de l\'exécution de cette commande');
            message.channel.send(err);
        }
        if (data.length > 2000)
            return message.channel.send('Veuillez saisir quelque chose de moins de 2000 caractères!')

        message.channel.send('```' + data + '```')
        })
    }
    if (message.content.startsWith(prefix + 'avatar')) {
        message.delete();
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let user = message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author;
    let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });
    let embed = new Discord.MessageEmbed()
    .setColor(`#4cd8b2`)
    .setDescription(`Avatar de ${user}`)
    .setImage(avatar)
    .setTimestamp();
    await message.channel.send(embed);
    }
    if (message.content == 'prefix') {
        message.delete();
        message.channel.send(`Le préfix du bot est : ${prefix}`)
    }
    if(message.content.startsWith(prefix + 'invite')) {
        message.delete();
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        let time;
        let timeInfo;
        let MAX;

        if (args[0] == 'permanent' || args[0] == 'perm') {

        time = 0
        timeInfo = 'est permanent !'
        MAX = 0
        } else {
        time = 86400
        timeInfo = ' est a usage unique et expire dans 24 heures !'
        MAX = 1
        }

        message.channel.createInvite({
            unique: true,
            maxAge: time,
            maxUses: MAX
            })
            .then(invite => {
            const Embed = new Discord.MessageEmbed()
                .setTitle('Lien généré')
                .setDescription('Bonjour à tous !\nVoici votre lien : https://discord.gg/' + invite.code)
                .setFooter(`Ce lien ${timeInfo}`)
                .setColor("#ff0000")

            message.channel.send(Embed)
        })
        .catch(console.error)
    }
    if (message.content.startsWith(prefix + 'stat')) {
        message.delete();
                const botinfo = new Discord.MessageEmbed()
                    .setAuthor(message.client.user.username)
                    .setTitle("__**Statistique :**__")
                    .setColor("#ff0000")
                    .addField("`👾` Développeur", `**Tim#7032**`, true)
                    .addField("`📁` Utilisateurs",`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`,true)
                    .addField("`📁` Serveurs", `${message.client.guilds.cache.size}`, true)
                    .addField("`📁` Channels ", `${message.client.channels.cache.size}`, true)
                    message.channel.send(botinfo);
    }
    if (message.content.startsWith(prefix + 'help')) {
        message.delete();
        let cmdmember = `\`userinfo\` \`serverinfo\` \`menu\` \`channelinfo\` \`bot\` \`voc\` \`suggestions\` \`roleinfo\` \`ascii\` \`stat\` \`avatar\` \`Invite\``
        let cmdadmin = 'Aucune commande admin est créer'
        let membed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor('Voici les commandes disponibles pour le bot')
        .setDescription(`**Le prefix du bot est : ${prefix}**`)
        .addField('Commandes pour les membres : ', cmdmember)
        .addField('Commandes pour les admins : ', cmdadmin)
        .setTimestamp()
        .setFooter('Dev | Footer')
        message.author.send(membed)
    }
    if (message.content.startsWith(prefix + 'bot')) {
        const membed = new Discord.MessageEmbed()
        .setColor('#B4E0E0')
        .setAuthor(`Info sur :  ${bot.user.username}`, bot.user.avatarURL())
        .addFields(
            {name: 'Mémoire', value: `${(process.memoryUsage().heapUsed / 1024 /1024).toFixed(2)}MB`, inline: true},
            {name: 'Uptime', value: `${Math.floor(bot.uptime /1000 / 60).toString()} minutes`, inline: true},
            {name: '\u200b', value: '\u200b', inline: true},
            {name: 'Serveurs', value: `${bot.guilds.cache.size.toString()}`, inline: true},
            {name: 'Salons', value: `${bot.channels.cache.size.toString()}`, inline: true},
            {name: 'Utilisateurs', value: `${bot.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}`, inline: true},
            {name: 'Version', value: `12.5.3`, inline: true},
            {name: 'Support', value: `[Serveur support](https://discord.gg/eMYKETk3PJ)`, inline: true},
        )
        message.channel.send(membed)
    }
});

const antiSpam = new AntiSpam({
    warnThreshold: 3,
    kickThreshold: 4,
    banThreshold: 5, 
    maxInterval: 1000, 
    warnMessage: '{@user}, Arret de spam.', 
    kickMessage: '**{user_tag}** a était kick pour spam.', 
    banMessage: '**{user_tag}** a était banni pour spam.', 
    maxDuplicatesWarning: 3, 
    maxDuplicatesKick: 5, 
    maxDuplicatesBan: 6, 
    exemptPermissions: [ 'ADMINISTRATOR'], 
    verbose: true,
    ignoredUsers: []
});
bot.on('message', async message => {
    if (message.author.bot || message.channel.type == 'dm') return;
    if (message.content.startsWith(prefix + 'cmd')) {
        message.delete();
        if (message.member.hasPermission('ADMINISTRATOR')){
            let cmdAdmin = `\`ban\` \`kick\` \`mute\` \`unmute\` \`perm\` \`voc\` \`clear\` \`warn\` \`tempmute\``
            let cmdtest = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setAuthor('Voci les commandes disponibles pour les admins')
            .setDescription(`**Le prefix du bot est : ${prefix}**`)
            .addField('Les commandes sont :', cmdAdmin)
            .setTimestamp()
            .setFooter('Dev | Admin')
            message.author.send(cmdtest)
        }
    }
    if (message.content.startsWith(prefix + 'commandes')) {
        message.delete();
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`Voici les commandes qui te sont réservés sur ce serveur`)
            .setColor('RANDOM')
            .addField('·  Ban :  ', 'Pour bannir des membres')
            .addField('·  Kick : ', 'Pour kick un membres')
            .addField('·  Mute:  ', 'Pour rendre muet un membre')
            .addField('·  Unmute:', 'Pour rendre la parole à un membre')
            .addField('·  Tempmute: ', 'Pour rendre temporairement muet un utilisateur')
            .addField('·  Perm:  ', 'Pour voir qui à les permission administrateur')
            .addField('·  Clear: ', 'Pour clear un nombre entre 1 et 999 de messages')
            .addField('·  Voc:   ', 'Pour savoir le nombre de membre connecter dans les vocaux')
            .addField('·  Commandes invisible',`tes commandes fait juste un ${prefix}cmd`)
            .addField('·  Warn:  ', 'Pour mettre un warn a un utilisatieur')
            .setTimestamp()
            .setFooter('Et voilà tu as toute les commandes en ta disposition')
        message.channel.send(embed)
        }
    }
    if (message.content.startsWith(prefix + "warn")) {
        message.delete();
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Tu n'as pas les permissions requises.")
        if (!args[0]) return message.channel.send("Vous devez mentionner quelqu'un.")
        let utilisateur = message.mentions.users.first() || message.guild.member(args[0])
        if (!bdd["warn"][utilisateur.id]) {
         bdd["warn"][utilisateur.id] = 1;
         Savebdd();
         return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissement.`)
        }
        if (bdd["warn"][utilisateur.id] == 2) {
         delete bdd["warn"][utilisateur.id]
         Savebdd();
         return message.guild.members.ban(utilisateur);

        } else {
         bdd["warn"][utilisateur.id]++
         Savebdd();
         return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissements.`)
        }
    }
    if (message.content.startsWith(prefix + 'tempmute')) {
        let mention = message.mentions.members.first();
    if(mention == undefined){
        message.reply('Membre non ou mal mentionné.');
    }
    else{
        let args = message.content.split(' ');

        mention.roles.add('ID MUTE');
        setTimeout(function () {
            mention.roles.remove('ID ROLE')
            message.channel.send('<@' + mention.id + '> tu peux désormais parler de nouveau !');
        }, args[2] * 1000);
    }
    }
});
bot.on('messageDelete', async message => {
    const embedLogsMessageDelete = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .addField('Message supprimé', message.content)
    .addField('Salon ou le message à était supprimé', message.channel)
    .setTimestamp()
    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsMessageDelete)
});
bot.on('roleUpdate', async (OldRole, newRole) => {
    const embedLogsRoleUpdate = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor('Role Update')
    .addField('Rôle mis à jour', OldRole.name)
    .setTimestamp()
    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsRoleUpdate)
});
bot.on('roleCreate', async (newRole) => {
    const embedLogsRoleCreate = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor('Role Create')
    .addField('Rôle créé', newRole)
    .setTimestamp()
    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsRoleCreate)
});
bot.on('roleDelete', async (role) => {
    const embedLogsRoleDelete = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor('Role Delete')
    .addField('Rôle supprimé', role.name)
    .setTimestamp()

    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsRoleDelete)
});
bot.on('inviteCreate', async invite => {
    const embedLogsInviteCreate = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor(invite.inviter.username, invite.inviter.displayAvatarURL({dynamic: true}))
    .addField('Lien d\'invitation créer', `discord.gg/${invite.code}`)
    .setTimestamp()
    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsInviteCreate)
});
bot.on('inviteDelete', async invite => {
    const embedLogsInviteDelete = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setAuthor('Suppression d\'une invitation', invite.guild.iconURL({dynamic: true}))
    .addField('Lien d\'invitation supprimé', `discord.gg/${invite.code}`)
    .setTimestamp()
    bot.guilds.cache.get('ID_GUILD').channels.cache.get('ID_LOGS').send(embedLogsInviteDelete)
});

function Savebdd() {
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send('Une erreur est survenue.')
    })
}
bot.login('TOKEN')