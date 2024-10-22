import { 
  Client, 
  ActivityType, 
} from 'discord.js';
import i18next from 'i18next';

import { container, } from '@ioc/di';

import { ClientReadyPort, } from '@application/ports/ClientReadyPort';

export class ClientReadyUseCase implements ClientReadyPort {
  async execute(client: Client): Promise<void> {
    console.log(`Bot is ready ${client.user?.tag}`);
    const guild_id = container.resolve<string>('server_id');

    client.user?.setActivity(`${client.user?.displayName}`, {
      type: ActivityType.Playing,
      url: 'https://gtastories.net/'
    });
    await client?.user?.setUsername('Maria Latorre');

    const guild = await client?.guilds?.fetch(guild_id);
    const language = guild?.preferredLocale;


  };
}