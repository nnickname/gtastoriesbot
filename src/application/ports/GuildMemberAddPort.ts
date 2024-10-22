import { GuildMember, } from 'discord.js';

export interface GuildMemberAddPort {
  execute(member: GuildMember): Promise<void>;
}