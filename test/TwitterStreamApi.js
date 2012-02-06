var assert = require('assert'),
    TwitterStreamApi = require('../lib/TwitterStreamApi.js');

describe('TwitterStreamApi.Client', function() {
    it('Should require a username', function() {
        assert.throws(function() {
            var api = new TwitterStreamApi.Client();
        }, /username is required/);
    });

    it('Should require a password', function() {
        assert.throws(function() {
            var api = new TwitterStreamApi.Client({username: 'test'});
        }, /password is required/);
    });

    it('Should set auth http option and default host', function() {
        var api = new TwitterStreamApi.Client({username: 'test', password: 'pass'});
        assert.equal(api.httpOptions.host, 'stream.twitter.com');
        assert.equal(api.httpOptions.auth, 'test:pass');
    });
});

