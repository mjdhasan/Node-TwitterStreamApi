var _ = require('underscore');

var defaults = {
    host: 'stream.twitter.com'
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
