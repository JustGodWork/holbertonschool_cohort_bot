const { Events } = require('discord.js');
const client = require('../../classes/HolbieClient');

client.on(Events.GuildMemberAdd, async (member) => {

    const role = member.guild.roles.cache.find(role => role.name === 'Visitor');

    try {
        await member.roles.add(role);
    } catch (error) {
        console.error(error);
    };

});