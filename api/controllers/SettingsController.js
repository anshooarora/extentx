/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    setTheme: function(req, res) {
        var theme = req.body.query.theme;

        if (typeof req.session.theme !== 'undefined' && req.session.theme === theme)
            req.session.theme = '';
        else
            req.session.theme = theme;

        res.send(200);
    },

};

