/**
 * StepService
 *
 * @description :: Server-side logic for managing Testings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getStepsGroupCounts(matcher, groupBy, cb) {
        Log.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: matcher },
                { $group: 
                    { 
                        _id: groupBy,
                        count: { $sum: 1 },
                    }, 
                } 
            ],
            function(err, result) {
                if (err) console.log(err);
                else cb(result);
            });
        });
    },
};