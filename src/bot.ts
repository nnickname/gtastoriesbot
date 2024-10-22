import 'dotenv/config';
import 'reflect-metadata';

import {
  REST, 
  Client,
  Collection, 
  GatewayIntentBits,
  Routes,
} from 'discord.js';

import * as ioc from '@ioc/di';

import { events, } from '@src/events';
import { commands, } from '@src/commands';

const token = ioc.container.resolve<string>('token');
const server_id = ioc.container.resolve<string>('server_id');
const application_id = ioc.container.resolve<string>('application_id');

const rest = new REST()
  .setToken(token);

async function start(): Promise<Client> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration,
    ],
  }) as Client;

  return client;
}

async function handleCommands(client: Client): Promise<Client> {
  client.commands = new Collection();

  for (const command of commands) {
    client.commands.set(command.data.name, command);
  }

  const formatCommands = Object
    .values(client.commands)
    .map(command => command.data);

  await rest.put(
    Routes.applicationGuildCommands(
      application_id,
      server_id,
    ),
    {
      body: formatCommands,
    },
  );

  return client;
}

async function handleEvents(client: Client): Promise<Client> {
  for (const event of events) {
    if (event.once) client.once(event.name, (...args) => event.execute(...args));
    else client.on(event.name, (...args) => event.execute(...args));
  }

  return client;
}

start()
  .then(handleCommands)
  .then(handleEvents)
  .then(c => c.login(token))
  .catch((err) => {
    console.log(err);
    process.exit(1)
  });
