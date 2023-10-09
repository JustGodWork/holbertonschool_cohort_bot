class ScheduledTime {

    /**
     * @param {Number} hour
     * @param {Number} minute
     */
    constructor(hour, minute) {
        this.hour = hour;
        this.minute = minute;
        this.handle = new Date();
        this.handle.setHours(this.hour, this.minute);
    };

};

module.exports = ScheduledTime;