const fs = require('fs');

fs.readdirSync('./events/entities').forEach((eventFile) => {
    require(`./entities/${eventFile}`);
    console.log(`Loaded event file ${eventFile}.`);
});