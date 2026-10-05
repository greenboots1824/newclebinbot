const {
  SlashCommandBuilder,
  MessageFlags
} = require('discord.js');

const { getAvatar } = require('../../functions/avatar.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar de um usuário')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('O usuário que você quer ver')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const avatar = getAvatar(user);

    await interaction.reply({
      content: avatar,
      flags: MessageFlags.Ephemeral
    });
  }
}