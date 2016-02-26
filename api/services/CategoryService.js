/**
 * CategoryService
 *
 * @description :: Server-side logic for managing Testings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getNames: function(cb) {
        Category.native(function(err, collection) {
            collection.distinct('name', function(err, result) {
                if (err) console.log(err);
                else cb(result);
            });
        });
    },
    
    getCategoryGroupCounts: function(matcher, groupBy, cb) {
        Category.native(function(err, collection) {
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