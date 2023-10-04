const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

class Command {

    /**
     *
     * @param {SlashCommandBuilder} handler
     * @param {function(CommandInteraction): void} callback
     */
    constructor(handler, callback) {
        this.handler = handler;
        this.callback = callback;
        this.sub_callbacks = new Map();
    };

    /**
     *
     * @param {string} subName
     * @param {function(CommandInteraction): void} callback
     * @returns {Command}
     */
    addSubCallback(subName, callback) {
        this.sub_callbacks.set(subName, callback);
        return this;
    };

};

module.exports = Command;