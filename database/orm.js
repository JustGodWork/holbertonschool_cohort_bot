const mongo = require('mongoose');
const db_url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

mongo.connection.once('open', function() {
    console.log('[DATABASE] Connected.');
});

(async () => {
    try {
        await mongo.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch (error) {
        console.log(`[DATABASE ERROR]: ${error}`);
    };
})();

module.exports = {
    'schema': mongo.Schema,
    'model': mongo.model
};