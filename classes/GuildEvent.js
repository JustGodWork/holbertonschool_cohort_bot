const ScheduledTime = require('./ScheduledTime.js');
const {
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    GuildScheduledEventManager
} = require('discord.js');

class GuildEvent {

    /**
     *
     * @param {GuildScheduledEventManager} manager
     * @param {String} name
     * @param {String} description
     * @param {String} link
     * @param {ScheduledTime} startAt
     * @param {ScheduledTime} endAt
     */
    constructor(manager, name, description, link, startAt, endAt) {
        this.manager = manager;
        this.name = name;
        this.description = description;
        this.link = link;
        this.startAt = startAt;
        this.endAt = endAt;
        this.initialize();
    };

    async initialize() {
        this.manager.create({
            name: this.name,
            scheduledStartTime: this.startAt.handle,
            scheduledEndTime: this.endAt.handle,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            description: this.description,
            channel: undefined,
            entityMetadata: {location: this.link},
            image: undefined,
            reason: `${this.name} event created by the scheduler.`
        });
    };

};

module.exports = GuildEvent;