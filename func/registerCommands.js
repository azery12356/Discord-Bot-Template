require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { clientId } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
const log = global.log;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		log.log(`Started refreshing ${commands.length} commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		log.log(`Successfully reloaded ${data.length} commands.`);
	}
    catch (error) {
		// And of course, make sure you catch and log any errors!
		log.error(error);
	}
})();