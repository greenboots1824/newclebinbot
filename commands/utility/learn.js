const { 
  SlashCommandBuilder,
  MessageFlags
} = require('discord.js');

const { insertDatabaseInfo } = require('../../functions/db.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('learn')
    .setDescription('Ensina uma frase o bot')
    .addStringOption(option =>
      option
        .setName('frase')
        .setDescription('A frase para ensinar')
        .setRequired(true)
    ),

  async execute(interaction) {
    const msg = interaction.options.getString('frase');
    const user = interaction.user.username;

    await insertDatabaseInfo(msg, user);

    await interaction.reply({
      content: `Mensagem "${msg}" aprendida!`,
      flags: MessageFlags.Ephemeral
    });
  }
}