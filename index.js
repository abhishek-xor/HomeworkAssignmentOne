// import { StringDecoder } from 'string_decoder';

/*
* Primary file for the API
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');


// instantiate http server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});


httpServer.listen(config.httpPort, function () {
    console.log('The server is listing on port ' + config.httpPort + ' in ' + config.envName + ' node.')
});

httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'value' : fs.readFileSync('./https/cert.pem')
};

console.log(httpsServerOptions)

// instantiate http server
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});


httpsServer.listen(config.httpsPort, function () {
    console.log('The server is listing on port ' + config.httpsPort + ' in ' + config.envName + ' node.')
});

// http and https server logic
var unifiedServer = function (req, res) {
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object.
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {
        buffer += decoder.end();

        // handle chosen
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        chosenHandler(data, function (statusCode, payload) {
            // use the status code callback by the handler for default to 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

            // Use the payload by the handler 
            payload = typeof (payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning these reponses: ', statusCode, payloadString);
        });
    });
}

// Declare Handler
var handlers = {};

// Sample Handler
handlers.sample = function (data, callback) {
    callback(406, { 'name': 'Abhishek Shukla' });
}


// Ping Handler
handlers.ping = function (data, callback) {
    callback(200);
}

handlers.notFound = function (data, callback) {
    callback(404);
};
// Routers
const router = {
    'ping': handlers.ping,
    'sample': handlers.sample
}