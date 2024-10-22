import {
  userMention,
  GuildMember, 
  EmbedBuilder, 
} from 'discord.js';

import { container, } from '@ioc/di';

import { GuildMemberAddPort, } from '@application/ports/GuildMemberAddPort';

export class GuildMemberAddUseCase implements GuildMemberAddPort {
  async execute(member: GuildMember): Promise<void> {
    const welcome_channel_id = container
      .resolve<string>('welcome_channel_id');

    if (member?.user?.bot) return;

    const welcomeChannel = await member?.guild?.channels?.fetch(welcome_channel_id);
    if (!welcomeChannel) return;

    const bot_id = container
      .resolve<string>('application_id');

    const bot = await member.guild.members?.fetch(bot_id!);

    const welcomeMessage = new EmbedBuilder()
      .setColor('#c91310')
      /*.setAuthor({
        name: 'Maria Latorre',
        iconURL: bot.displayAvatarURL()!,
      })*/
      .setTitle('Welcome To Your Stories')
      .setThumbnail(member.displayAvatarURL())
      .setDescription(`
        Bienvenid@, ${userMention(member.id)} a Grand Theft Auto Stories! 
        Nos alegra que te unas a nuestro **Comunidad Oficial**. 
        Aquí, serás parte de el servidor mas interactivo de GTA.
      `)
      .setFooter({
        text: `https://gtastories.net`
      });
    
      const embedMessage = new EmbedBuilder()
      .setTitle("Validar usuario")
      .setDescription(
        `
        Ingresa tu Nombre de usuario de GTA Stories en el canal de **Verificación**.
        Recuerda que para un formato válido,
        debes utilizar la convención **Nombre_Apellido**. De lo contrario
        no podremos verificar tú nombre.
      `
      )
      .setColor("#c91310")
      .setAuthor({
        name: "Validador",
      });
    if (!welcomeChannel.isTextBased()) return;
    await member.send({
      embeds: [embedMessage,],
    });
    await welcomeChannel
      .send({
        target: member,
        embeds: [welcomeMessage,],
      });
  }
}