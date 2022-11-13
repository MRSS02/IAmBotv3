require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');

const Discord = require("discord.js");
const intents = new Discord.IntentsBitField((parseInt(process.env.INTENTS, 10)));
const bot = new Discord.Client({intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const token = process.env.TOKEN;

const messageCreate = require("./scripts/messageCreate")

function changeStatus() {
  let initialAct = Math.round(Math.random());
  if (initialAct == 0) bot.user.setActivity("TowerFall 2");
  else bot.user.setActivity("Celeste 3");
  
}

bot.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		bot.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//bot runs this everytime it starts
bot.on("ready", () => {
  console.log(`Hey. I was initialized inside ${bot.guilds.cache.size} servers.`);
  changeStatus();
  setInterval(changeStatus, 4000)
})

//bot runs this everytime a message is posted.
bot.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`The command ${interaction.commandName} doesn't exist!`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Uh oh... Something bad happened!', ephemeral: true });
	}
});

//bot runs this everytime a reaction is added.
bot.on('messageReactionAdd', async (reaction, user) => {
   
});

//bot runs this everytime a reaction is removed
bot.on('messageReactionRemove', async (reaction, user) => {
    
});

//This sets the bot online.
bot.login(token);
