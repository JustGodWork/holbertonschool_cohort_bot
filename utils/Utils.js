const StringUtils = require('./entities/StringUtils');

class Utils {
    constructor() {
        this.string = StringUtils;
    };
};

module.exports = new Utils();