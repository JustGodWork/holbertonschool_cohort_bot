const client = require('../classes/HolbieClient');
const scheduler = require('node-schedule');
const { Events, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventManager } = require('discord.js');

/**
 * @param {number} startHour
 * @param {number} startMinute
 * @param {number} endHour
 * @param {number} endMinute
 * @returns {{at: Date, end: Date}}
 */
function defineTimestamp(startHour, startMinute, endHour, endMinute) {
    const at = new Date();
    at.setHours(startHour, startMinute);
    const end = new Date();
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

/**
 * @param {Range} dayOfWeek
 * @param {function(GuildScheduledEventManager): void} callback
 */
function startScheduler(dayOfWeek, callback) {
    scheduler.scheduleJob({
        hour: 9,
        minute: 0,
        dayOfWeek: dayOfWeek
    }, async () => {
        const guilds = client.guilds.cache;
        guilds.forEach(async guild => {
            const events = guild.scheduledEvents;
            await callback(events);
        });
    });
};

function initializeEventScheduler() {
    startScheduler(new scheduler.Range(1, 5), scheduleSpeakerOfTheDay);
    startScheduler(new scheduler.Range(2, 5), scheduleStandUp);
};

client.on(Events.ClientReady, initializeEventScheduler);