import { 
  Message,
  Interaction, 
  SlashCommandBuilder, 
  ApplicationCommandType,
  MessageType,
  InteractionType,
  EmbedBuilder,
} from 'discord.js';

import { container, } from '@ioc/di';

import { InteractionCreatePort, } from '@application/ports/InteractionCreatePort';
import { posttitleCommand } from './commands/newpost';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => Promise<void>;
};

export const commands = <Array<Command>>[
  
  posttitleCommand,
  {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Check bot availability'),
    async execute (interaction) {
      if (interaction.isCommand && interaction.isCommand()) {
        console.log('interaction commmand');
      }

      if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
        console.log('interaction chat input');
      }

      if (interaction.type === InteractionType.ApplicationCommand) {
        console.log('interaction command');
      }
      console.log('interaction', interaction);
      
      if (interaction.isRepliable()) {
        await interaction.reply('Pong!');
      } else {
        console.error('Interaction is not repliable');
      }
      
      // const useCase = container
      //   .resolve<InteractionCreatePort>('InteractionCreate');
      // await useCase.execute(interaction);
    },
  },
  
];
