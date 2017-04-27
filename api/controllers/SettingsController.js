/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    updateDataPointSetting: function(req, res) {
        if (typeof req.body.query !== 'undefined') {
            var pts = req.body.query.dataPoints;
            if (typeof pts !== 'undefined')
                req.session.trendDataPoints = pts;

            var format = req.body.query.dataPointFormat;
            if (typeof format !== 'undefined')
                req.session.trendDataPointFormat = format;
        }

        res.send(200);
    },

    setTheme: function(req, res) {
        var theme = req.body.query.theme;

        if (typeof req.session.theme !== 'undefined' && req.session.theme === theme)
            req.session.theme = '';
        else
            req.session.theme = theme;

        res.send(200);
    },

};

