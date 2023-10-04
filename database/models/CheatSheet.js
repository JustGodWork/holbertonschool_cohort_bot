const {model, schema} = require('../orm');

const schema_cheatsheet = new schema({
    'name': {
        'type': String,
        'required': true
    },
    'label': {
        'type': String,
        'required': true
    },
    'link': {
        'type': String,
        'required': true
    },
});

module.exports = model('CheatSheet', schema_cheatsheet);