/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    var settings = [
        {
            name: 'trendDataPoints',
            value: 5
        }, {
            name: 'deleteReportsOlderThanDays',
            value: 60
        }
    ];
    
    sails.on('lifted', function() {
        // default settings
        Settings.find().exec(function(err, res) {
            if (err) console.log(err);
            
            if (!res || !res.length) {
                Settings.create(settings).exec(function(err, res) { });
            }
        });
        
        // default user [admin]
        User.find({ user: 'admin' }).exec(function(err, user) {
            if (err) throw (err);
            
            if (!user || !user.length) {
                var bcrypt = require('bcryptjs');
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync('password', salt);

                User.create({
                    name: 'root',
                    password: hash,
                    admin: true
                }).exec(function(err, created) { });
            }
        });
    });
    
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
