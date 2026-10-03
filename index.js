const fs = require('node:fs');
const path = require('node:path');

// Importing discord.js
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags
} = require('discord.js');

// Loading .env files
require('dotenv/config').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`I'm ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readFileSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const command = fs.readdirSync(
    commandsPath.filter(
      (file) => file.endsWith('.js')
    )
  );

  for (const folder of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[W] The command at ${filePath} is missing a "data" or "execute" property.`)
    }
  }
}

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
});

