/**
 * DirectoryService
 *
 * @description :: directory service
 */

var mkdirp = require('mkdirp');

module.exports = {
    createFolder: function(path, cb) {
        mkdirp(path, function(err) {
            if (err) cb(err);
            else cb(null);
        });
    },
};