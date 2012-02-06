var _     = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    https = require('https');

var defaultHttpOptions = {
    host: 'stream.twitter.com',
    connection: 'keep-alive'
};

exports.ResponseProcessor = function(res, emitter) {
    res.on('data', function(buffer) {
        var str = buffer.toString();
        if (str !== '\r') {
            var ent = JSON.parse(str);
            if ('delete' in ent) {
                emitter.emit('delete', ent['delete'].status);
            } else if ('scrub_geo' in ent) {
                emitter.emit('delete_location', ent.scrub_geo);
            } else if ('limit' in ent) {
                emitter.emit('limit', ent.limit.track);
            } else if ('warning' in ent) {
                emitter.emit('stall_warning', ent.warning);
            } else {
                emitter.emit('status', ent);
            }
        }
    });
};

exports.Client = function(options) {
    options = (options || {});
    if (!options.username) {
        throw 'username is required';
    }

    if (!options.password) {
        throw 'password is required';
    }

    this.httpOptions = _.extend({}, defaultHttpOptions, {
        auth: options.username + ':' + options.password
    });
};

exports.Client.prototype = Object.create(EventEmitter.prototype);

exports.Client.prototype.stream = function(httpOptions) {
    httpOptions = _.extend(this.httpOptions, httpOptions);
    var self = this;
    var req = https.request(httpOptions, function(res) {
        new exports.ResponseProcessor(res, self);
    });
    req.end();
};

var defaultFilterOptions = {
    track: [],
    count: 0,
    delimited: 'length',
    follow: [],
    locations: [],
    stall_warnings: true
};

exports.Client.prototype.filter = function(options) {
    options = _.extend(defaultFilterOptions, options);
    if (!options.track.length && !options.follow.length && !options.locations.length) {
        throw 'at least one filter predicate is required (track, follow or locations)';
    }
};
