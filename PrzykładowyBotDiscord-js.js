import { Client } from 'discord.js'; // Better imports (ES6)
import { prefix, token } from './config.json';
const client = new Client(); // New Discord client

client.on('ready', () => { // Bot has logged in
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('guildCreate', guild => { // Bot has been added to guild
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('guildDelete', guild => { // Bot has been removed from guild
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('message', async message => {
	if (message.author.bot) return; // Block messages from other bots
	if (!message.guild) return; // Block messages in DMs
	if (message.content.indexOf(prefix) !== 0) return; // Block messages that don't start with bot's prefix

	const args = message.content.slice(prefix.length).trim().split(/ +/g); // Command arguments
	const command = args.shift().toLowerCase(); // Command name
	
	// Weź pan zrób command handlera...
	if (command === 'ping') { // Send bot ping in ms
		const msg = await message.channel.send('Ja ci kurwa dam ping! ||chyba że serwera o IP 85.128.214.88||');
		msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}

	if (command === 'say') { // Say something as bot
		message.delete().catch(fuckAnime => { }); // If an error has occured, remember to fuck anime!
		const sayMessage = args.join(' '); // Message to send
		message.channel.send(sayMessage);
	}

	if (command === 'kick') { // Kick mondonno
		// mondonno kurwa, co żeś to tak spierdzielił
		if (!message.member.roles.some(r => ['Administrator', 'Moderator'].includes(r.name)))
			return message.reply(`Cyka blyat don't use this command!`);

		let member = message.mentions.members.first(); // Po chuj kickować kogoś kogo nie ma? Ano tak, bo mondonno nie ma mózgu...
		if (!member)
			return message.reply('Please mention a valid member of this server');
		if (!member.kickable)
			return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');

		let reason = args.slice(1).join(' '); // Reason of the kick
		if (!reason) reason = 'mondonno ma zawsze rację, nawet jeśli jej nie ma!';

		await member.kick(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of: ${error}`));
		message.reply(`${member.user.tag} has been kicked by ${message.author.tag}. Reason: ${reason}`);
	}

	if (command === 'ban') { // Ban mondonno
		if (!message.member.roles.some(r => ['Administrator'].includes(r.name)))
			return message.reply(`You are gay, because you aren't Administrator!`);

		let member = message.mentions.members.first() | message.guild.members.get(args[0]); // Member to be banned (probably marketing's spy)

		if (!member)
			return message.reply('Please mention a valid member of this server');

		if (!member.bannable)
			return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');

		let reason = args.slice(1).join(' '); // Reason of the ban

		if (!reason) reason = 'mondonno ma zawsze rację, nawet jeśli jej nie ma!';

		await member.ban(reason)
			.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
		message.reply(`${member.user.tag} has been banned by ${message.author.tag}. Reason: ${reason}`);
	}

	if (command === 'purge') { // Delete mondonno's stupid messages
		const deleteCount = parseInt(args[0], 10);

		if (!deleteCount || deleteCount < 1|| deleteCount > 100)
			return message.reply('Please provide a number between 1 and 100 for the number of messages to delete');

		const fetched = await message.channel.fetchMessages({ limit: deleteCount });
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
});

client.login(token | 'Njg4MzEyODYxOTI3Mjc2NTU0.XuXUng.fddFirQeBRzAL9D07LTw6D2VOnk'); // Login bot to Discord
