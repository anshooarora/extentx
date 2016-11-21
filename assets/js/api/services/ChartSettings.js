angular.module('ExtentX').    
    factory('ChartSettings', function() {
        var scales = {
            xAxes: [{
                gridLines: {
                    color: "rgba(242, 242, 242, .7)",
                },
                ticks: {
                    fontSize: 11,
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(242, 242, 242, .7)",
                },
                ticks: {
                    fontSize: 11,
                    userCallback: function(label, index, labels) {
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
                },
                beginAtZero: true,
            }]
        };
        
        return {
            scales: scales,
        }
    });
    
