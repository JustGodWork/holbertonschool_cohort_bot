class StringUtils {

    /**
     * Capitalize the first letter of a string
     * @param {String} str
     * @return {String}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

};

module.exports = new StringUtils();