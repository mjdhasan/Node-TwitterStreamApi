var assert = require('assert'),
    http = require('http'),
    TwitterStreamApi = require('../lib/TwitterStreamApi.js');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('test');
});

describe('TwitterStreamApi.client', function() {
    it('Should require a username', function() {
        assert.throws(function() {
            var api = new TwitterStreamApi.client();
        }, /username is required/);
    });

    it('Should require a password', function() {
        assert.throws(function() {
            var api = new TwitterStreamApi.client({username: 'test'});
        }, /password is required/);
    });

    it('Should set auth http option and default host', function() {
        var api = new TwitterStreamApi.client({username: 'test', password: 'pass'});
        assert.equal(api.httpOptions.host, 'stream.twitter.com');
        assert.equal(api.httpOptions.auth, 'test:pass');
    });

});
