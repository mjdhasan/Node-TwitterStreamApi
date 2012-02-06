var assert = require('assert'),
    TwitterStreamApi = require('../lib/TwitterStreamApi.js');

describe('TwitterStreamApi.client', function() {
    it('Should require a username', function() {
        assert.throws(function() {
            var api = new TwitterStreamApi.client();
        }, /username is required/);
    });
});
