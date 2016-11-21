angular.module('ExtentX').
    factory('LineChartSettings', function() {
        var options = {
            scaleFontSize: 10,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        var datasetOverrideGreen = [
            {
                borderWidth: 1,
                backgroundColor: 'rgba(75,192,192,0.05)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: "#00AF9A",
                pointHoverBackgroundColor: 'rgba(75,192,192,0.1)',
                pointHoverBorderColor: "rgba(75,192,192,0.1)",
                type: 'line'
            },
        ];

        var datasetOverrideRed = [
            {
                borderWidth: 1,
                backgroundColor: 'rgba(255,90,94,.2)',
                borderColor: 'rgba(255,90,94,.5)',
                pointBackgroundColor: '#FF6347',
                pointHoverBackgroundColor: 'rgba(255,90,94,.2)',
                pointHoverBorderColor: "rgba(255,90,94,.2)",
                type: 'line'
            }
        ];

        var datasetOverride = [
            {
                label: "Pass",
                borderWidth: 1,
                backgroundColor: 'rgba(75,192,192,0.1)',
                borderColor: '#33cc99',
                pointBackgroundColor: "#00AF9A",
                pointHoverBackgroundColor: 'rgba(75,192,192,0.1)',
                pointHoverBorderColor: "rgba(75,192,192,0.1)",
                type: 'line'
            },
            {
                label: "Fail",
                borderWidth: 1,
                backgroundColor: 'rgba(255,90,94,.2)',
                borderColor: 'rgba(255,90,94,.5)',
                pointBackgroundColor: '#FF6347',
                pointHoverBackgroundColor: 'rgba(255,90,94,.2)',
                pointHoverBorderColor: "rgba(255,90,94,.2)",
                type: 'line'
            },
            {
                label: "Others",
                borderWidth: 1,
                backgroundColor: 'rgba(253, 180, 92, .2)',
                borderColor: 'rgba(253, 180, 92, .3)',
                pointBackgroundColor: '#DAA520',
                pointHoverBackgroundColor: 'rgba(253, 180, 92, .2)',
                pointHoverBorderColor: "rgba(253, 180, 92, .2)",
                type: 'line'
            }
        ];

        return {
            options: options,
            datasetOverride: datasetOverride,
            datasetOverrideGreen: datasetOverrideGreen,
            datasetOverrideRed: datasetOverrideRed,
        };
    });