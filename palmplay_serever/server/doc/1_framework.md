### nodelibc node js 工具封装

https://www.npmjs.com/package/nodelibc

Usage:
// Add this line in your entry file.
require('compilec');
1. Useful functions, such as "trim","md5","requestGet" and so on...
const nodelib = require('nodelibc');

console.log(nodelib.md5('123456'));
2. Cache
const nodelib = require('nodelibc');

global.cache = new nodelib.Cache('cachefile.json');

cache.set('key1', 'some value');
cache.incr('key2');

console.log(cache.get('key1'));
console.log(cache.get('key2'));

cache.save(true); // sync save cache to file
3. Http
const nodelib = require('nodelibc');

const server = new nodelib.Http(3000, (res, data, req) => {
    console.log(data);
    server.send(res, 'Hello World!');
});
4. Https
const fs = require('fs');
const nodelib = require('nodelibc');

const server = new nodelib.Https({
        key:fs.readFileSync('your key pem path.'),
        cert:fs.readFileSync('your cert pem path.')
    }, 3000, (res, data, req) => {
        console.log(data);
        server.send(res, 'Hello World!');
    }
);
5. Udp
const nodelib = require('nodelibc');
const server = new nodelib.Udp(3000, (rinfo, data) => {
    console.log(data);
    server.send(rinfo, 'Hello World!');
});
6. SocketTCP
const nodelib = require('nodelibc');
const server = new nodelib.SocketTCP(3000, (socket, data) => {
    console.log(data);
    server.send(socket, 'Got message');
    server.broadcast('Hello World!');
});
7. SocketWS
// npm install ws
const nodelib = require('nodelibc');
const server = new nodelib.SocketWS(3000, (socket, data) => {
    console.log(data);
    server.send(socket, 'Got message');
    server.broadcast('Hello World!');
});
8. Redis
// npm install redis
const nodelib = require('nodelibc');

global.redis = new nodelib.Redis({
    host:'127.0.0.1',
    // password:'',
    db:1,
    prefix:'prefix_'
});

redis.set('key1', 'some value', 5);
redis.incr('key2');

console.log(cache.get('key1'));
console.log(cache.get('key2'));
9. Mysql
// npm install mysql
const nodelib = require('nodelibc');

global.mysql = new nodelib.Mysql('127.0.0.1', 'root', 'root', 'test');

mysql.getArray('SELECT * FROM user', users => {
    console.log(users);
});

### compilec runing jsc

Running ".jsc"
Usage:
require('compilerc');
Compile ".js" to ".jsc":
const fs = require('fs');
const compiler = require('compiler');

function encrypt(buf) {
    return Buffer.from(compiler.encrypt(buf, 'compile'));
};

fs.writeFileSync('somefile.jsc', encrypt(fs.readFileSync('somefile.js')))

### server 快速创建nodejs server 

> Ease to create nodejs server, include http,https,tcp,udp,websocket,security websocket.

Http:
// npm install serverc
// index.js

require('compilec');

const path = require('path');
const nodelib = require('nodelibc');
const server = require('serverc');

server.runHTTP(
    3000,
    new nodelib.Router(path.join(__dirname, 'routes')), // route of the server (You should create a folder named routes, and create logic handlers in it.)
    null, // secret
    null, // domain (Could be '*' when you are testing.)
    false, // sign (Check sign or not)
    300000 // timeout (Compare server timestamp with client timestamp, if more then this value will return directly.)
);
Websocket:
// npm install ws
// index.js

require('compilec');

const path = require('path');
const nodelib = require('nodelibc');
const server = require('serverc');

server.runServerWS(
    3000,
    new nodelib.JsonHandler(false), // handler (Could be JsonHandler, ProtobufHandler, BufferHandler, JsonHandler argument 1 means compress or not)
    new nodelib.Router(path.join(__dirname, 'routes')), // route of the server (You should create a folder named routes, and create logic handlers in it.)
    null // secret
);

// Logic code file
const server = require('serverc');
server.broadcast('some message...');

### moment

A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.

[](http://momentjs.com/docs/)


### mysql

Introduction
This is a node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.

Here is an example on how to use it:

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
From this example, you can learn the following:

Every method you invoke on a connection is queued and executed in sequence.
Closing the connection is done using end() which makes sure all remaining queries are executed before sending a quit packet to the mysql server.

[](https://www.npmjs.com/package/mysql)

### request 

Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.


### uuid

Simple, fast generation of RFC4122 UUIDS.

Then generate your uuid version of choice ...

Version 1 (timestamp):

const uuidv1 = require('uuid/v1');
uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
 
Version 3 (namespace):

const uuidv3 = require('uuid/v3');
 
// ... using predefined DNS namespace (for domain names)
uuidv3('hello.example.com', uuidv3.DNS); // ⇨ '9125a8dc-52ee-365b-a5aa-81b0b3681cf6'
 
// ... using predefined URL namespace (for, well, URLs)
uuidv3('http://example.com/hello', uuidv3.URL); // ⇨ 'c6235813-3ba4-3801-ae84-e0a6ebb7d138'
 
// ... using a custom namespace
//
// Note: Custom namespaces should be a UUID string specific to your application!
// E.g. the one here was generated using this modules `uuid` CLI.
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
uuidv3('Hello, World!', MY_NAMESPACE); // ⇨ 'e8b5a51d-11c8-3310-a6ab-367563f20686'
 
Version 4 (random):

const uuidv4 = require('uuid/v4');
uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
 
Version 5 (namespace):

const uuidv5 = require('uuid/v5');
 
// ... using predefined DNS namespace (for domain names)
uuidv5('hello.example.com', uuidv5.DNS); // ⇨ 'fdda765f-fc57-5604-a269-52a7df8164ec'
 
// ... using predefined URL namespace (for, well, URLs)
uuidv5('http://example.com/hello', uuidv5.URL); // ⇨ '3bbcee75-cecc-5b56-8031-b6641c1ed1f1'
 
// ... using a custom namespace
//
// Note: Custom namespaces should be a UUID string specific to your application!
// E.g. the one here was generated using this modules `uuid` CLI.
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
uuidv5('Hello, World!', MY_NAMESPACE); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
