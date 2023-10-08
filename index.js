require('dotenv').config({path: './.env'});
const client = require('./classes/HolbieClient');
const { Events } = require('discord.js');
require('./commands/command_handler');
require('./commands/command_loader');
require('./scheduler/guild_events')
require('./database/orm');

client.on(Events.ClientReady, (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);