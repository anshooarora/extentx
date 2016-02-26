/**
 * DateTimeService
 *
 * @description :: Server-side logic for managing Testings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    dateToLocaleString: function(date, cb) {
        var dt = new Date(date).toLocaleDateString().replace(',', '');
        return cb(dt);
    },
};