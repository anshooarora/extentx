/**
 * TestService
 *
 * @description :: Server-side logic for managing Testings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getTest: function(id, cb) {
        Test.findOne({
            id: id
        }).exec(function(err, result) {
            if (err) console.log('TestService.getTest -> ' + err);
            
            cb(result);
        });
    },
    
    getTests: function(json, cb) {
        Test.find(
            json
        ).exec(function(err, result) {
            if (err) console.log('TestService.getTests -> ' + err);
            
            cb(result);
        });
    },
    
    getLogs: function(json, cb) {
        Test.find(
            json
        ).populate('logs').exec(function(err, result) {
            if (err) console.log('TestService.getLogs -> ' + err);
            
            cb(result);
        });
    },
    
    getChildren: function(json, cb) {
        Test.find(
            json
        ).populateAll().exec(function(err, result) {
            if (err) console.log('TestService.getChildren -> ' + err);
            
            cb(result);
        });
    },
    
    getTestsGroupCounts(matcher, groupBy, sortBy, cb) {
        Test.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: matcher },
                { $group: 
                    { 
                        _id: groupBy,
                        count: { $sum: 1 },
                    }, 
                },
                { $sort : sortBy },
                { $limit: 10 }
            ],
            function(err, result) {
                if (err) console.log(err);
                else cb(result);
            });
        });
    },
};