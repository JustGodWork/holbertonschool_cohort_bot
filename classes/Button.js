const { ButtonStyle, ButtonBuilder, Interaction, CommandInteraction } = require("discord.js");
const client = require("../classes/HolbieClient");
const { Events } = require("discord.js");

class Button {

    static styles = {
        PRIMARY: ButtonStyle.Primary,
        SECONDARY: ButtonStyle.Secondary,
        SUCCESS: ButtonStyle.Success,
        DANGER: ButtonStyle.Danger,
        LINK: ButtonStyle.Link,
    };

    static buttons = {};

    /**
     * Create a new button
     * @param {String} id
     * @param {String} label
     * @param {ButtonStyle>} style
     * @param {String} emoji
     * @param {String} url
     * @param {Boolean} disabled
     * @return {Button}
     */
    static create(id, label, style, emoji, url, disabled) {
        return new Button(id, label, style, emoji, url, disabled);
    };

    /**
     * @param {String} id
     * @return {Button}
     */
    static get(id) {
        return this.buttons[id];
    };

    /**
     * @returns {Button[]}
     */
    static getAll() {
        return this.buttons;
    };

    /**
     * Create a new button
     * @param {String} id
     * @param {String} label
     * @param {ButtonStyle} style
     * @param {String} emoji
     * @param {String} url
     * @param {Boolean} disabled
     * @return {Button}
     */
    constructor(id, label, style, emoji, url, disabled) {
        this.id = id;
        this.handle = new ButtonBuilder({
            custom_id: id,
            label: label,
            style: style,
            emoji: emoji,
            url: url,
            disabled: disabled
        });
        this.callback = null;
        Button.buttons[id] = this;
    };

    /**
     * @param {function(Interaction | CommandInteraction): void} callback
     * @return {Button}
     */
    setCallback(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        this.callback = callback;
        return this;
    };

};

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const component = interaction.component;
    const button = Button.get(component.data.custom_id);

    await interaction.deferUpdate();

    try {
        if (!button) return;
        if (typeof button.callback === 'function') {
            await button.callback(interaction);
        };
    } catch (error) {
        console.error(error);
    };

});

module.exports = Button;