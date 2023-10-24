const scheduler = require('node-schedule');
const client = require('../classes/HolbieClient');
const GuildEvent = require('../classes/GuildEvent');
const ScheduledTime = require('../classes/ScheduledTime');
const {
    Events,
    GuildScheduledEventManager
} = require('discord.js');

const scheduledLaunch = {
    hour: 8,
    minute: 30,
};

/**
 * @param {Number | Range} dayOfWeek
 * @param {function(GuildScheduledEventManager): void} callback
 */
function addScheduler(dayOfWeek, callback) {
    scheduler.scheduleJob({
        hour: scheduledLaunch.hour,
        minute: scheduledLaunch.minute,
        dayOfWeek: dayOfWeek
    }, () => {
        const guilds = client.guilds.cache;
        guilds.forEach(guild => {
            const events = guild.scheduledEvents;
            callback(events);
        });
    });
};

client.on(Events.ClientReady, () => {

    addScheduler(new scheduler.Range(1, 5), (events) => new GuildEvent(
        events,
        'Speaker of the day',
        'A new day, a new speaker!',
        process.env.SOD_LINK,
        new ScheduledTime(11, 30),
        new ScheduledTime(11, 45)
    )); // Monday to Friday

    addScheduler(new scheduler.Range(2, 5), (events) => new GuildEvent(
        events,
        'Stand Up',
        'A new day, a new stand up!',
        process.env.STAND_UP_LINK,
        new ScheduledTime(11, 45),
        new ScheduledTime(12, 0)
    )); // Tuesday to Friday

    addScheduler(1, events => new GuildEvent(
        events,
        'Check In',
        'An new monday, a new Check In!',
        process.env.CHECK_IN_LINK,
        new ScheduledTime(9, 15),
        new ScheduledTime(9, 45)
    )); // Monday

});