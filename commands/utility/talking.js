const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { consultDatabaseConfig, editDatabaseConfig } = require("../../functions/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alternarfala')
    .setDescription('Liga/desliga a fala do Clebinho')
    .addBooleanOption(option =>
      option
        .setName('estado')
        .setDescription('Liga ou desliga a fala automatica')
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildIdActual = interaction.guildId;
    const getInformation = await consultDatabaseConfig(guildIdActual);
    const chooseUser = interaction.options.getBoolean('estado');

    const getPrefix = getInformation.prefix;
    const autoMsgState = getInformation.automsg;

    if (autoMsgState === 1) {
      if (chooseUser === true) {
        await interaction.reply({
          content: "As mensagens automáticas já estão ligadas!",
          flags: MessageFlags.Ephemeral
        })
      } else {
        await editDatabaseConfig(
          guildIdActual,
          getPrefix,
          chooseUser ? 1 : 0
        );

        await interaction.reply({
          content: "Mensagens automáticas foram ligadas!",
          flags: MessageFlags.Ephemeral
        })
      }
    } else {
      if (chooseUser === false) {
        await interaction.reply({
          content: "As mensagens automáticas já estão desligadas!",
          flags: MessageFlags.Ephemeral
        })
      } else {
        await editDatabaseConfig(
          guildIdActual,
          getPrefix,
          chooseUser ? 1 : 0
        );

        await interaction.reply({
          content: "Mensagens automáticas foram desligadas!",
          flags: MessageFlags.Ephemeral
        })
      }
    }
  }
}