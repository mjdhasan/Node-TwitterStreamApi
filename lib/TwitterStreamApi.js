function client(options) {
    options = (options || {});
    if (!options.username) {
        throw 'username is required';
    }
}
exports.client = client;
client.test = function(){};
