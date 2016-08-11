/**
 * FileService
 *
 * @description :: file service
 */

var mv = require('mv');

module.exports = {
    moveFile: function(pathFrom, pathTo) {
        mv(pathFrom, pathTo, {mkdirp: true}, function(err) {
            if (err) console.log(err);
        });
    },
};