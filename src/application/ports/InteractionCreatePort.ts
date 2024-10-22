import { BaseInteraction, } from 'discord.js';

export interface InteractionCreatePort {
  execute(interaction: BaseInteraction): Promise<void>;
}