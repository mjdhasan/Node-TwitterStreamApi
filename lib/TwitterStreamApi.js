var _     = require('underscore'),
    https = require('https');

var defaults = {
    host: 'stream.twitter.com'
};

var parseData = function(buffer) {
    var str = buffer.toString();
    if (str !== '\r') {
        console.log(JSON.parse(str).text);
    }
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

client.prototype.stream = function(httpOptions) {
    httpOptions = _.extend(this.httpOptions, httpOptions);
    var req = https.request(options, function(res) {
        res.on('data', parseData);
    });
};
