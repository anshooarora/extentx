angular.module('ExtentX').    
    factory('BarChartSettings', function() {
        var options = {
            responsive: false,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    gridLines: {
                        display: true,
                        lineWidth: 1,
                    },
                    ticks: {
                        beginAtZero: true,
                        mirror: false,
                        suggestedMin: 0,
                    },
                    stacked: true,
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontSize: 10
                    },
                    barPercentage: 0.1,
                }],
            }
        };
        return {
            options: options
        }
    });