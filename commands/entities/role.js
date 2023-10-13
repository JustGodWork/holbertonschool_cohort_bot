const Command = require("../../classes/Command");
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage member rôles.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('add')
            .setDescription('Add a rôle to a user.')
            .addUserOption(option => option.setName('user').setDescription('The visitor').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    async (interaction) => {
        await interaction.reply({content: "No command matching this name was found.", ephemeral: true});
    }
).addSubCallback('add', async (interaction) => {

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const role = interaction.guild.roles.cache.find(role => role.name === 'Member');

    try {

        if (member.roles.cache.some(role => role.name === 'Member')) {
            await interaction.reply({content: `**${member.user.username}** already has the role.`, ephemeral: true});
            return;
        };

        await member.roles.add(role);
        await interaction.reply({content: `**${member.user.tag}** has been given the role. ✔`, ephemeral: true});

    } catch (error) {
        await interaction.reply({content: "An error occured while trying to give the role.", ephemeral: true});
        console.error(error);
    };

});