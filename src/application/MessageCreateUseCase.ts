import { Message, EmbedBuilder } from "discord.js";

import { container } from "@ioc/di";

import { MessageCreatePort } from "@application/ports/MessageCreatePort";

export class MessageCreateUseCase implements MessageCreatePort {
  async execute(message: Message): Promise<void> {
    if (message?.author?.bot || message?.system) return;

    const prefix = container.resolve<string>("prefix");
    const verification_channel_id = container.resolve<string>(
      "verification_channel_id"
    );

    if (message?.content?.startsWith(prefix)) {
      const args = message?.content?.slice(prefix?.length).trim().split(/\s+/);
      const commandName = args.shift()?.toLowerCase();

      await this.executeCommand(message, commandName!);
      return;
    }

    if (message?.channelId === verification_channel_id)
      return await this.executeVerification(message);
  }

  async executeCommand(message: Message, commandName: string): Promise<void> {
    const command = message.client?.commands?.get(commandName);
    if (!command) return;

    // console.log("command", command);
    await command.execute(message);
  }

  async executeVerification(message: Message): Promise<void> {
    const newUserNickname = this.transformValidUsername(message?.content);
    if (!newUserNickname) {
      const embedMessage = new EmbedBuilder()
        .setTitle("Formato incorrecto")
        .setDescription(
          `
          Recuerda que para un formato válido,
          debes utilizar la convención **Nombre_Apellido**. De lo contrario
          no podremos verificar tú nombre.
        `
        )
        .setColor("#c91310")
        .setAuthor({
          name: "Validador",
        });

      await message.author.send({
        embeds: [embedMessage],
      });
      if (message.deletable) await message.delete();
      return;
    }

    try {
      const verification_role_id = container.resolve<string>(
        "verification_role_id"
      );

      const duplicatedNicknameMember = message.guild?.members?.cache?.find(
        (m) => m.nickname === newUserNickname
      );
      if (duplicatedNicknameMember?.nickname === newUserNickname) {
        const embedMessage = new EmbedBuilder()
          .setTitle("Oops!")
          .setDescription(
            `Actualmente ya hay un usuario con el nombre que has seleccionado`
          );

        await message.author.send({
          target: message.author,
          embeds: [embedMessage],
        });
        if (message?.deletable) await message.delete();
        return;
      }

      if (!message?.guild?.members?.me?.permissions?.has("ManageNicknames"))
        return;
      if (message.member?.roles?.cache?.has(verification_role_id)) {
        const currentRole =
          message.member.roles?.cache?.get(verification_role_id);

        const embedMessage = new EmbedBuilder()
          .setTitle("Verificación completa")
          .setDescription(
            `
            Parece que ya has hecho la verificación previamente y posees el nombre de usuario adecuado (siguiendo el formato de **Nombre_Apellido**) y el rol ${currentRole?.name}.
          `
          )
          .setColor("#c91310");

        await message.author.send({
          target: message.author,
          embeds: [embedMessage],
        });
        if (message.deletable) await message.delete();
        return;
      }

      await message.member?.setNickname(newUserNickname);
      await message.member?.roles?.add(verification_role_id);
      await message.delete();
    } catch (err) {
      console.log(JSON.stringify(err));

      const embedMessage = new EmbedBuilder()
        .setTitle("Algo salió mal")
        .setDescription(
          "Pero no te preocupes... puedes reintentar de nuevo mas tarde"
        );

      await message.reply({
        target: message?.author,
        embeds: [embedMessage],
      });
    }
  }

  private transformValidUsername(username: string): string | null {
    const validatorRegex = /^[a-zA-Z]+[_ ]+[a-zA-Z]+$/;
    if (!validatorRegex.test(username)) return null;

    return username.replace("_", " ");
  }
}
