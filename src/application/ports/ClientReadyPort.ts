import { Client, } from 'discord.js';

export interface ClientReadyPort {
  execute(client: Client): Promise<void>;
};