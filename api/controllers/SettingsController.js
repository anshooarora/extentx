/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    dataPointSettings: function(req, res) {
        if (typeof req.body.query !== 'undefined') {
            var pts = req.body.query.dataPoints;
            if (typeof pts !== 'undefined')
                req.session.trendDataPoints = pts;

            var format = req.body.query.dataPointFormat;
            if (typeof format !== 'undefined')
                req.session.trendDataPointFormat = format;
        }

        res.send(200);
    }
};