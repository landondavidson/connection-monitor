require('dotenv').config();

module.exports = function() {
    return {
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        port: 1433,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        pool: { idleTimeoutMillis: 1000 },
        options: { encrypt: true },
        connectionTimeout: 15 * 1000,
        debug: true
    };
};
