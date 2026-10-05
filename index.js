// Loading environment file
require('dotenv').config();

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

const {
  startDatabase,
  insertDatabaseInfo,
  consultDatabaseConfig,
  editDatabaseConfig,
  randomDatabase,
  searchDatabaseRandomRegex
} = require('./functions/db.js')

const {
  algorithmRNG,
  arrayRandomReturn
} = require('./functions/algorithm.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  startDatabase();
  console.log(`[*] Online como ${client.user.tag}!`);
  console.log(`[*] Estou em ${client.guilds.cache.size} servidores!`);
  //console.log(`I'm ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[W] The command at ${filePath} is missing a "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (
      interaction.replied ||
      interaction.deferred
    ) {
      await interaction.followUp({
        content: 'Ocorreu um erro enquanto foi executado este comando!\nPor favor, contactar o(s) desenvolvedor(es)!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'Ocorreu um erro enquanto foi executado este comando!\nPor favor, contactar o(s) desenvolvedor(es)!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// This is only to speak with the members :P
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userContent = message.content;
  const guildId = message.guild.id;
  const autoMsgFunction = await consultDatabaseConfig(guildId);
  const checkAutoMsg = autoMsgFunction.automsg;

  if (checkAutoMsg === 1) {
    let registerRNG = algorithmRNG(20);
    let speakRNG = algorithmRNG(20);

    const arrayPhrase = userContent.trim().split(/\s+/);
    let arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

    const maxRolls = algorithmRNG(arrayPhrase.length);

    if (registerRNG < 16) {
    // Register the last phrase/word sended
      if (
        arrayRandom === `<@${client.user.id}>` ||
        userContent === `<@${client.user.id}>`
      ) return;

      registerRNG = algorithmRNG(3);
      const authorMessage = message.author.username;

      if (registerRNG === 1) {
        await insertDatabaseInfo(arrayRandom, authorMessage); // Random word
      } else if (registerRNG === 2) {
        await insertDatabaseInfo(userContent, authorMessage); // Random phrase
      } else if (registerRNG === 3) {
        const arrayWords = [];

        for (let i = 0; i < maxRolls; i++) {
        arrayRandom = await arrayRandomReturn(userContent);

          if (!arrayWords.includes(arrayRandom)) {
            await insertDatabaseInfo(arrayRandom, authorMessage);
          }

          arrayWords.push(arrayRandom);
        }
      }
    }

    if (speakRNG < 14) {
      // Speak a random phrase/word
      let phraseToSpeak;

      do {
        speakRNG = algorithmRNG(3);

        if (speakRNG === 1) {
        phraseToSpeak = await searchDatabaseRandomRegex(arrayRandom);
        } else if (speakRNG === 2) {
        phraseToSpeak = await randomDatabase();
        } else {
        // Pick up a random word inside the database :D
        phraseToSpeak = arrayRandomReturn(await randomDatabase());
        }

        if (phraseToSpeak === null) return;
      } while (phraseToSpeak === userContent);

      message.reply(phraseToSpeak);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
