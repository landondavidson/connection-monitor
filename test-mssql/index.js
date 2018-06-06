let appInsights = require("applicationinsights");
if (!appInsights.defaultClient) {
   appInsights.setup().start();
}
let client = appInsights.defaultClient; 

const connection = require('../get-connection'); 
module.exports = function(context, myTimer) {
    // assign an operation Id for the client
    var operationIdKey = client.context.keys.operationId;
    client.context.tags[operationIdKey] = context.invocationId;
    const pool = connection.createConnection(context); 
    var success = false;
    let startTime = Date.now();
    pool.request().query('select 1 as number', (err, result) => {
       let duration = Date.now() - startTime;
        if (err) {
            client.trackException({ exception: err });
            client.flush({callback: ()=>{
                context.done(err);
            }});
        } else {
            success = true; 
            context.log(result);
            success = true;
            client.trackDependency({
                target: 'database',
                name: 'select 1',
                data: JSON.stringify(result),
                duration: duration,
                resultCode: 0,
                success: success,
                dependencyTypeName: 'SQL'
            });
            client.flush({callback: ()=>{
                context.done();
            }});
        }
    });
};
