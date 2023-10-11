'use strict';

require('compilec');

const path = require('path');
const nodelib = require('nodelibc');
const server = require('serverc');

// server.runHTTP(
//     3000,
//     new nodelib.Router(path.join(__dirname, 'routes')), // route of the server (You should create a folder named routes, and create logic handlers in it.)
//     null, // secret
//     null, // domain (Could be '*' when you are testing.)
//     false, // sign (Check sign or not)
//     300000 // timeout (Compare server timestamp with client timestamp, if more then this value will return directly.)
// );

server.runHTTP(
    7000,
    new nodelib.Router(path.join(__dirname, "routes")),
    "016D178ABA3BA84B8C616587E017F122",
    '*',
    true
);

process.on('uncaughtException', e => {
    console.error(e);
});
