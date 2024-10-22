import { Command } from "@src/commands";
import { Interaction, SlashCommandBuilder } from "discord.js";

const posttitleCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('posttitle')
        .setDescription('Post a title to the channel'),
    execute: async function (interaction: Interaction): Promise<void> {
        
    }
};

export { posttitleCommand };
