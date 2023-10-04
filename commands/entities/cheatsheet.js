const utils = require("../../utils/Utils");
const Command = require("../../classes/Command");
const { CommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const CheatSheet = require("../../database/models/CheatSheet");

/**
 *
 * @param {Array<CheatSheet>} name
 * @param {String} name
 * @param {CommandInteraction} interaction
 * @return {Boolean}
 */
async function doesCheatSheetExist(cheatSheets, name, interaction) {
    for (let cheatSheet of cheatSheets) {
        if (cheatSheet.name === name) {
            return true;
        };
    };
    return false;
};

/**
 *
 * @param {CommandInteraction} interaction
 */
async function add(interaction) {

    /** @type {String} */
    const name = interaction.options.getString('name');

    const cheatSheets = await CheatSheet.find();
    const cheatSheetExist = await doesCheatSheetExist(cheatSheets, name, interaction);

    if (cheatSheetExist) {
        await interaction.reply({content: "A cheat sheet with this name already exists.", ephemeral: true});
        return;
    };

    try {
        const current = new CheatSheet({
            'name': name,
            'label': utils.string.capitalize(name),
            'link': interaction.options.getString('link'),
        });
        await current.save();
        await interaction.reply({content: "Cheat sheet added successfully.", ephemeral: true});
    } catch (error) {
        await interaction.reply({content: "An error occured while trying to add the cheat sheet.", ephemeral: true});
        return;
    };

};

/**
 *
 * @param {CommandInteraction} interaction
 */
async function remove(interaction) {

    const name = interaction.options.getString('name');

    const cheatSheets = await CheatSheet.find();
    const cheatSheetExist = await doesCheatSheetExist(cheatSheets, name, interaction);

    if (!cheatSheetExist) {
        await interaction.reply({content: "No cheat sheet with this name exist.", ephemeral: true});
        return;
    };

    try {
        await CheatSheet.deleteOne({'name': name});
        await interaction.reply({content: "Cheat sheet removed successfully.", ephemeral: true});
    } catch (error) {
        await interaction.reply({content: "An error occured while trying to remove the cheat sheet.", ephemeral: true});
        return;
    };

};

/**
 *
 * @param {CommandInteraction} interaction
 */
async function list(interaction) {
    const cheatSheets = await CheatSheet.find();
    if(cheatSheets.length === 0) {
        await interaction.reply({content: "No cheat sheet found.", ephemeral: true});
        return;
    };
    try {
        let message = "***Here is the list of all the cheat sheets:***\n";
        for (let cheatSheet of cheatSheets) {
            message += `**Name:** ${cheatSheet.name} - **Label:** ${cheatSheet.label} - **Link:** ${cheatSheet.link}\n`;
        };
        await interaction.reply({content: message, ephemeral: true});
    } catch (error) {
        await interaction.reply({content: "An error occured while trying to list the cheat sheets.", ephemeral: true});
        return;
    };

};

module.exports = new Command(
    new SlashCommandBuilder()
        .setName("cheatsheet")
        .setDescription("Manage cheat sheets.")
        .addSubcommand(subcommand =>
            subcommand.setName("add")
            .setDescription("Add a new cheat sheet.")
            .addStringOption(option =>
                option.setName('name')
                .setDescription('The name of the cheat sheet.')
                .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('link')
                .setDescription('The link to the cheat sheet.')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
            .setDescription("Remove a cheat sheet.")
            .addStringOption(option =>
                option.setName('name')
                .setDescription('The name of the cheat sheet.')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("list")
            .setDescription("List all the cheat sheets.")
        )
    ,
    async (interaction) => {
        await interaction.reply("No command matching this name was found.");
    }
).addSubCallback("add", add)
.addSubCallback("remove", remove)
.addSubCallback("list", list);