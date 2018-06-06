const sql = require('mssql');
const connectionConfig = require('./connection');
const appInsights = require('applicationinsights');
let client = new appInsights.TelemetryClient();

var config = connectionConfig();
let connection = null;
let runCount = 0;
let startTime;

/**
 * create and return an instance of a sql server connection using the mssql
 * library. Also, handle errors thrown by the connection as appropriate.
 * @return {Connection} - an instance of mssql's connection class.
 */
const createConnection = function(context) {
    runCount++;
    // assign an operation Id for the client
    var operationIdKey = client.context.keys.operationId;
    client.context.tags[operationIdKey] = context.invocationId;
    if (!connection) {
        startTime = new Date();
        let config = connectionConfig();
        connection = new sql.ConnectionPool(config, err => {
            if (err) {
                context.log(err.stack);
            } else {
                context.log(`Total Time Up: ${Date.now() - startTime}`)
                context.log(`> SQL connection established to ${config.server}/${config.database}.`);
            }
        });
        connection.on('error', errorHandler);
        connection.on('debug', debugHandler);
        function reconnect() {
            config.connectionTimeout = config.connectionTimeout + 100;
            connection.connect(errorHandler);
        }
        function debugHandler(tedious, message){
            client.trackTrace({message:message});
            context.log(message);
        }
        function errorHandler(err) {
            context.log(err);
            client.trackException({exception: err});

            switch (err.code) {
                case 'ELOGIN':
                    break;

                case 'ETIMEOUT':
                    reconnect();
                    break;

                case 'ESOCKET':
                    reconnect();
                    break;

                default:
                    reconnect();
                    break;
            }
        }
    }
    else{
    }
    return connection;
};

const resetConnection = function(context){
    connection = null;   
};

module.exports = {
    createConnection,
    resetConnection
}