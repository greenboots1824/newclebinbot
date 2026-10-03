const { 
  SlashCommandBuilder,
  MessageFlags
} = require('discord.js');

async function checkExistence(url) {
  const response = await fetch(url);

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dicio')
    .setDescription('Mostra o significado da palavra')
    .addStringOption((option) =>
      option
        .setName('word')
        .setDescription('A palavra à ser pesquisada')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const word = interaction.options.getString('word');
    const url = `https://s.dicio.com.br/${word}.jpg`;
    const response = await checkExistence(url);

    if (response) {
      await interaction.reply({
        content: url,
        flags: MessageFlags.Ephemeral
      });
    } else {
      await interaction.reply({
        content: "A palavra que você procura não foi encontrada!",
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
