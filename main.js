require('dotenv').config();
global.log = require("./func/log.js");
// Importing modules
const Discord = require('discord.js'),
	fs = require('fs'),
	path = require('node:path'),
    	commandsPath = path.join(__dirname, 'commands'),
	log = global.log;

require("./func/registerCommands");


// Create a new Discord client instance
const Client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

// Exec this code when Client receive the ready event
Client.on('ready', () => {
	log.log(`Logged in as ${Client.user.tag}`);
});

Client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		Client.commands.set(command.data.name, command);
        log.log(`Loaded ${command.data.name} command`);
	}
    else {
		log.warn(`Command at '${filePath}' don't have a data or execute statement`);
	}
}

// Log in to Discord with your client's token
Client.login(process.env.TOKEN);

Client.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		log.warn(`${interaction.user.tag} tried to execute non existent command ${interaction.commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
		log.log(`${interaction.user.tag} executed ${interaction.commandName} command`);
	}
	catch (error) {
		log.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: `Il y as eu une erreur lors de l'exécution de cette commande.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `Il y as eu une erreur lors de l'exécution de cette commande.`, ephemeral: true });
		}
	}
});
