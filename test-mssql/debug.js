require('dotenv').config();
const testmssql = require('./index.js');

const context = {
  log: console.log,
  done: () => {
    console.log('completed');
  }
};
testmssql(context);
