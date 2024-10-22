import { BaseInteraction, } from 'discord.js';

import { InteractionCreatePort, } from '@application/ports/InteractionCreatePort';

export class InteractionCreateUseCase implements InteractionCreatePort {
  async execute(interaction: BaseInteraction): Promise<void> {
    // console.log('interaction', interaction);
    if (!interaction) return;

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply("Comando inexistente");
      return;
    }

    await command.execute(interaction);
  }
}
