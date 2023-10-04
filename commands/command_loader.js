const fs = require('fs');
const client = require('../classes/HolbieClient');
const { REST, Routes } = require('discord.js');
const Command = require('../classes/Command');
const commands = [];

const rest = new REST().setToken(process.env.TOKEN);

fs.readdirSync('./commands/entities').forEach((commandFile) => {
    /** @type {Command} */
    const command = require(`./entities/${commandFile}`);
    if (!command instanceof Command) {
        console.error(`Command ${commandFile} is not a Command instance.`);
    } else {
        console.log(`Loaded command file ${commandFile}.`);
        client.commands.set(command.handler.name, command);
        commands.push(command.handler.toJSON());
    };
});

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    };
})();