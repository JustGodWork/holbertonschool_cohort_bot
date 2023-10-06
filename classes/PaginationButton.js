const Button = require("./Button");
const PaginationData = require("./PaginationData");

class PaginationButton extends Button {

    /**
     * Create a new button
     * @param {String} id
     * @param {String} label
     * @param {ButtonStyle} style
     * @param {String} emoji
     * @param {String} url
     * @param {Boolean} disabled
     * @param {PaginationData} data
     * @return {Button}
     */
    constructor(id, label, style, emoji, url, disabled, data) {
        super(id, label, style, emoji, url, disabled);
        this.data = data;
    };

    incrementPage() {
        if (this.data.currentPage < this.data.totalPages) {
            this.data.currentPage++;
            return;
        };
        this.data.currentPage = 0;
    };

    decrementPage() {
        if (this.data.currentPage > 0) {
            this.data.currentPage--;
            return;
        };
        this.data.currentPage = this.data.totalPages;
    };

};

module.exports = PaginationButton;