const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('O bot repetirá o que você escrever!')
    .addStringOption((option) =>
      option
        .setName('mensagem')
        .setDescription('Messagem que será reenviada')
        .setRequired(true)
    ),

  async execute(interaction) {
    const messageUser = interaction.options.getString('mensagem');
    
    await interaction.reply(messageUser);
  }
}
