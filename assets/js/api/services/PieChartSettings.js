angular.module('ExtentX').    
    factory('PieChartSettings', function() {
        var options = {
            legend: {
                display: true,
                labels: {
                    boxWidth: 10
                }
            },
            responsive: false,
            maintainAspectRatio: true
        };
        var colors = [ '#00af00', '#F7464A', '#8b0000', '#ff6347', '#FDB45C', '#1e90ff', '#222' ];
        
        return {
            options: options,
            colors: colors
        }
    });