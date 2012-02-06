var _     = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    https = require('https');

var defaults = {
    host: 'stream.twitter.com',
    connection: 'keep-alive'
};

function client(options) {
    options = (options || {});
    if (!options.username) {
        throw 'username is required';
    }

    if (!options.password) {
        throw 'password is required';
    }

    this.httpOptions = _.extend({}, defaults, {
        auth: options.username + ':' + options.password
    });
}

exports.client = client;

client.prototype = Object.create(EventEmitter.prototype);

var responseProcessor = exports.responseProcessor = function(res, emitter) {
    res.on('data', function(buffer) {
        var str = buffer.toString();
        if (str !== '\r') {
            emitter.emit('data', str);
        }
    });
};

client.prototype.stream = function(httpOptions) {
    httpOptions = _.extend(this.httpOptions, httpOptions);
    var self = this;
    console.log(httpOptions);
    var req = https.request(httpOptions, function(res) {
        new responseProcessor(res, self);
    });
    req.end();
};
