angular.module('ExtentX').
    factory('LineChartSettings', function() {
        var options = {
            scaleFontSize: 10,
            scaleBeginAtZero: true
        };
        var colors = [
            { 
                fillColor: '#E6F9F6',
                strokeColor: '#33cc99',
                pointColor: '#00AF9A',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)'
            }, {
                fillColor: 'rgba(255,90,94,.2)',
                strokeColor: 'rgba(255,90,94,.5)',
                pointColor: 'rgba(255,90 94,.5)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
            }, {
                fillColor: 'rgba(253, 180, 92, .1)',
                strokeColor: 'rgba(253, 180, 92, .3)',
                pointColor: 'rgba(253, 180, 92, .5)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(253, 180, 92, 1)',
            }
        ];
        
        return {
            options: options,
            colors: colors
        };
    });
