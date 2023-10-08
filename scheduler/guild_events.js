const client = require('../classes/HolbieClient');
const scheduler = require('node-schedule');
const { Events, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventManager } = require('discord.js');

/**
 * @returns {{at: Date, end: Date}}
 */
function defineTimestamp(startHour, startMinute, endHour, endMinute) {
    const at = new Date();
    at.setDate(at.getDate() + 1);
    at.setHours(startHour, startMinute);
    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(endHour, endMinute);
    return {at, end};
};

/**
 * @param {GuildScheduledEventManager} events
 */
async function scheduleSpeakerOfTheDay(events) {
    const {at, end} = defineTimestamp(11, 30, 11, 45);
    console.log('Speaker of the day event starting...');
    await events.create({
        name: 'Speaker of the day',
        scheduledStartTime: at,
        scheduledEndTime: end,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        description: 'A new day, a new speaker!',
        channel: undefined,
        entityMetadata: {location: 'https://holberton-fr.zoom.us/j/84822594283?pwd=aW5kRGpXcTFQb3hrUld2WjhsbExyQT09'},
        image: undefined,
        reason: 'Speaker of the day event created by the scheduler.'
    });
};

/**
 * @param {GuildScheduledEventManager} events
 */
async function scheduleStandUp(events) {
    const {at, end} = defineTimestamp(11, 45, 12, 0);
    console.log('Stand Up event starting...');
    await events.create({
        name: 'Stand Up',
        scheduledStartTime: at,
        scheduledEndTime: end,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        description: 'A new day, a new stand up!',
        channel: undefined,
        entityMetadata: {location: 'https://discordapp.com/channels/976357520895528960/1116818498212085881'},
        image: undefined,
        reason: 'Stand Up event created by the scheduler.'
    });
};

function initializeEventScheduler() {
    scheduler.scheduleJob({
        hour: 12,
        minute: 48,
        dayOfWeek: new scheduler.Range(1, 5)
    }, async () => {

        const guilds = client.guilds.cache;
        guilds.forEach(async guild => {
            const events = guild.scheduledEvents;
            await scheduleSpeakerOfTheDay(events);
            await scheduleStandUp(events);
        });

    });
};

client.on(Events.ClientReady, initializeEventScheduler);
