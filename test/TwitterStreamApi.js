var assert = require('assert'),
    TwitterStreamApi = require('../lib/TwitterStreamApi.js'),
    http = require('http'),
    EventEmitter = require('events').EventEmitter;

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

describe('TwitterStreamApi.ResponseProcessor', function() {
    it('Should emit statuses', function(done) {
        var mockResp = new EventEmitter();
        var emitter = new EventEmitter();

        var mockStatuses = [
            {text: 'Status 1'},
            {text: 'Status 2'},
            {text: 'Status 3'}
        ];

        var receivedStatuses = [];

        var inc = 0;
        emitter.on('status', function(status) {
            assert.equal(status.text, mockStatuses[inc++].text);
            if (3 == inc) {
                done();
            }
        });

        var respProcessor = new TwitterStreamApi.ResponseProcessor(mockResp, emitter);

        mockStatuses.forEach(function(status) {
            mockResp.emit('data', JSON.stringify(status) + '\r');
        });
    });

    it('Should emit delete notices', function(done) {
        var mockResp = new EventEmitter();
        var emitter = new EventEmitter();

        var mockStatuses = [
            {text: 'Status 1'},
            {'delete': {status: {text: 'deleted status'}}},
            {text: 'Status 3'}
        ];

        var receivedStatuses = [];

        var inc = 0;
        emitter.on('delete', function(status) {
            assert.equal(status.text, 'deleted status');
            done();
        });

        var respProcessor = new TwitterStreamApi.ResponseProcessor(mockResp, emitter);

        mockStatuses.forEach(function(status) {
            mockResp.emit('data', JSON.stringify(status) + '\r');
        });
    });

    it('Should emit delete location notices', function(done) {
        var mockResp = new EventEmitter();
        var emitter = new EventEmitter();

        var mockStatuses = [
            {text: 'Status 1'},
            {'scrub_geo': {user_id: 9999}},
            {text: 'Status 3'}
        ];

        var receivedStatuses = [];

        var inc = 0;
        emitter.on('delete_location', function(data) {
            assert.equal(data.user_id, 9999);
            done();
        });

        var respProcessor = new TwitterStreamApi.ResponseProcessor(mockResp, emitter);

        mockStatuses.forEach(function(status) {
            mockResp.emit('data', JSON.stringify(status) + '\r');
        });
    });
});
