class PaginationData {

    /**
     *
     * @param {Number} limit
     * @param {Array} data
     */
    constructor(limit, data) {
        this.currentPage = 0;
        this.limit = limit;
        this.totalPages = 0;
        this.pages = [];
        this.defaultData = data;
        this.initialize();
    };

    /**
     * Initialize the pagination
     * @private
     */
    initialize() {
        const data = this.defaultData;
        if (data.length <= this.limit)
            return;
        for (let i = 0; i < data.length; i++) {
            let page = Math.floor(i / this.limit);
            if (!this.pages[page]) this.pages[page] = [];
            this.pages[page].push(data[i]);
            this.totalPages = page;
        };
    };

    /**
     * @return {Array}
     */
    getCurrent() {
        if (this.defaultData.length <= this.limit)
            return this.defaultData;
        return this.pages[this.currentPage];
    };

};

module.exports = PaginationData;