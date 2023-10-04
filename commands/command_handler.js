const client = require('../classes/HolbieClient');
const { Events, Interaction, SlashCommandSubcommandBuilder } = require('discord.js');
const Command = require('../classes/Command');

/**
 *
 * @param {Command} command
 * @param {Interaction} interaction
 */
function handleSubCommand(command, interaction) {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand) {
        for (let option of command.handler.options) {
            if (option instanceof SlashCommandSubcommandBuilder) {
                if (option.name === subCommand) {
                    const callback = command.sub_callbacks.get(subCommand);
                    if (typeof callback === 'function') {
                        callback(interaction);
                        return true;
                    }
                };
            };
        };
    };
    return false;
};

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    /** @type {Command} */
	const command = client.commands.get(interaction.commandName);

	if (!command || !command instanceof Command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	};

	try {
        if(handleSubCommand(command, interaction)) return;
		await command.callback(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});