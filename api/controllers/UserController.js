/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
    
    login: function(req, res) {
        var name = req.body.query.name;
        var password = req.body.query.password;
        
        User.findOne({ name: name }).exec(function(err, user) {
            if (err) throw (err);
            
            if (typeof user !== 'undefined' && typeof password !== 'undefined' && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                req.session.authenticated = true;

                var user = req.session.user;
                delete user.password;
                
                res.send(200, { user: user } );
            } else {
                res.send(401);
            }
        });
    },
    
    isLoggedIn: function(req, res) {
        if (req.session.authenticated) {
            var user = req.session.user;
            delete user.password;
            
            res.send(200, { user: user } );
        } else {
            res.send(101);
        }
    },
    
    /**
     * sign up for a user account
     */
    signup: function(req, res) {
        var user = req.query.user;
        var password = req.query.password;

        User.find({ name: user }).exec(function(err, user) {
            if (err) throw (err);
            
            if (user.length > 0) {
                
            }
            else {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);

                User.create({ 
                    name: user,
                    password: hash 
                }).exec(function(err, created) {
                    if (err) throw (err);
                    
                    // signup success
                    res.send(200);
                });
            }
        });
    },    
    
    logout: function(req, res) {
        req.session.destroy();
        res.send(200);
    },    
}