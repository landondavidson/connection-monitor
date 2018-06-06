# connection-monitor

A project set up to test error received connecting to Azure SQL using mssql and tedious

## Getting Started

Five Environment Variables are needed to run this application

- DB_SERVER - name of the database server
- DB_NAME - name of the database
- DB_USER - user to log into the database
- DB_PASSWORD - the password to log into the database
- APPINSIGHTS_INSTRUMENTATIONKEY - intrumentation key to use to connect to application insights

## Purpose

This project is a Azure function implementation that is use to stress the node packages mssql and tedious.  
When connecting to Azure SQL Databases we have noticed that our connections will randomly hang over time.
After running this function every second for about 24 hours the function will begin to fail with time out errors
and never recover until the function application is restarted. We have tracked down the problem to when the TLS is being
negotiated the socket will close in the process. A pull request has been submitted to the tedious repository with a fix
the worked for us. https://github.com/tediousjs/tedious/pull/753
