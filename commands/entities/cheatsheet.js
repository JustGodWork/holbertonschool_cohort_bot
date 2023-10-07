const fs = require("fs");
const utils = require("../../utils/Utils");
const Command = require("../../classes/Command");
const PaginationData = require("../../classes/PaginationData");
const CheatSheet = require("../../database/models/CheatSheet");
const { CommandInteraction, Attachment } = require("discord.js");
const PaginationButton = require("../../classes/PaginationButton");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require("@discordjs/builders");

/**
 * Does data exist in the database
 * @param {Array<CheatSheet>} name
 * @param {String} name
 * @param {CommandInteraction} interaction
 * @return {Boolean}
 */
async function doesCheatSheetExist(cheatSheets, name) {
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
async function request(interaction) {

    const cheatSheets = await CheatSheet.find();

    if(cheatSheets.length === 0) {
        await interaction.reply({content: "No cheat sheet found.", ephemeral: true});
        return;
    };

    const file_name = `./data/${interaction.user.id}_current_request.json`;

    try {
        let data = [];
        for (let cheatSheet of cheatSheets) {
            data.push({
                name: cheatSheet.name,
                label: cheatSheet.label,
                link: cheatSheet.link,
            });
        };
        fs.writeFileSync(file_name, JSON.stringify(data, null, 4));
        await interaction.reply({
            content: `There is **${data.length}** contents.`,
            files: [
                new Attachment({
                    name: "data.json",
                    url: file_name,
                    ephemeral: true,
                    contentType: "application/json",
                    description: "Here is the list of all requested data."
                }),
            ],
            ephemeral: true
        });
        fs.rmSync(file_name);
    } catch (error) {
        await interaction.reply({content: "An error occured while requesting the cheat sheets.", ephemeral: true});
        console.error(error);
        return;
    };

};

/**
 * Create the embed
 * @param {CommandInteraction} interaction
 * @return {EmbedBuilder}
 */
function createEmbed(interaction) {
    return new EmbedBuilder()
        .setTitle("Cheat sheets")
        .setDescription("Here is the list of all the cheat sheets.")
        .setColor([150, 50, 0])
        .setTimestamp()
        .setFooter({
            text: "HolbieBot",
            iconURL: interaction.client.user.avatarURL()
        });
};

/**
 *
 * @param {EmbedBuilder} embed
 * @param {Array} data
 */
function formatEmbed(embed, data) {
    embed.data.fields = [];
    for (let value of data) {
        embed.addFields({name: `↓${value.label}↓`, value: `[Click me to open](${value.link})`, inline: true});
    };
};

/**
 * Set the previous button callback
 * @param {CommandInteraction} interaction
 * @param {EmbedBuilder} embed
 * @param {ActionRowBuilder} row
 * @param {PaginationButton} button
 */
async function setPreviousPaginationCallback(interaction, embed, row, button) {
    button.decrementPage();
    formatEmbed(embed, button.data.getCurrent());
    embed.setFooter({text:`HolbieBot | Page ${button.data.currentPage + 1}/${button.data.totalPages + 1}`, iconURL: embed.data.footer.icon_url});
    await interaction.editReply({embeds: [embed], components: [row], ephemeral: true});
};

/**
 * Set the next button callback
 * @param {CommandInteraction} interaction
 * @param {EmbedBuilder} embed
 * @param {ActionRowBuilder} row
 * @param {PaginationButton} button
 * @return {number}
 */
async function setNextPaginationCallback(interaction, embed, row, button) {
    button.incrementPage();
    formatEmbed(embed, button.data.getCurrent());
    embed.setFooter({text:`HolbieBot | Page ${button.data.currentPage + 1}/${button.data.totalPages + 1}`, iconURL: embed.data.footer.icon_url});
    await interaction.editReply({embeds: [embed], components: [row], ephemeral: true});
};

/**
 *
 * @param {CommandInteraction} interaction
 */
async function show(interaction) {

    const cheatSheets = await CheatSheet.find();

    if(cheatSheets.length === 0) {
        await interaction.reply({content: "No cheat sheet found.", ephemeral: true});
        return;
    };

    try {

        const embed = createEmbed(interaction);
        const data = new PaginationData(8, cheatSheets);
        formatEmbed(embed, data.getCurrent());

        if (cheatSheets.length >= data.limit) {

            embed.setFooter({text:`HolbieBot | Page ${data.currentPage + 1}/${data.totalPages + 1}`, iconURL: embed.data.footer.icon_url});

            const previous = new PaginationButton(`previous_help_${interaction.user.id}`, 'Previous page', PaginationButton.styles.SECONDARY, null, null, false, data);
            const next = new PaginationButton(`next_help_${interaction.user.id}`, 'Next page', PaginationButton.styles.PRIMARY, null, null, false, data);

            const row = new ActionRowBuilder()
                .addComponents(previous.handle, next.handle);

            previous.setCallback(async () => await setPreviousPaginationCallback(interaction, embed, row, previous));
            next.setCallback(async () => await setNextPaginationCallback(interaction, embed, row, next));

            await interaction.reply({embeds: [embed], components: [row], ephemeral: true});

        } else await interaction.reply({embeds: [embed], ephemeral: true});

    } catch (error) {
        await interaction.reply({content: "An error occured while trying to list the cheat sheets.", ephemeral: true});
        console.error(error);
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
            subcommand.setName("request")
            .setDescription("Request all the cheat sheets in JSON format.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("show")
            .setDescription("Show all the cheat sheets.")
        )
    ,
    async (interaction) => {
        await interaction.reply({content: "No command matching this name was found.", ephemeral: true});
    }
).addSubCallback("add", add)
.addSubCallback("remove", remove)
.addSubCallback("request", request)
.addSubCallback("show", show);