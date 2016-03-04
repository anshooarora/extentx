$(document).ready(function() {
    /* 
    * creates charts for Analysis -> Trends page
    */ 
    createAnalysisTrendCharts();
    
    /* 
    * hide all 0 values from status distribution 
    */
    $('.sr-only').filter(function() {
        return ($(this).text() == '0');
    }).addClass('hidden');
});

function createAnalysisTrendCharts() {
    if (!$('#test-trends') || $('#test-trends').length === 0) return;
    
    $.ajax({
        method: 'get',
        url: '/reportDistribution',
        data: { limit: 5 }
    }).done(function(res) {
        stepTrendsChart(res.logDistribution);
        testTrendsChart(res.testDistribution);
    });
}

function getTrendData(passed, failed, others, labels) {
    var data = {
        labels: labels,
        datasets: [
            {
                label: 'Pass',
                fillColor: '#E6F9F6',
                strokeColor: '#33cc99',
                pointColor: '#00AF9A',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: passed
            },
            {
                label: 'Fail',
                fillColor: 'rgba(255,90,94,.2)',
                strokeColor: 'rgba(255,90,94,.5)',
                pointColor: 'rgba(255,90 94,.5)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
                data: failed
            },
            {
                label: 'Others',
                fillColor: 'rgba(253, 180, 92, .1)',
                strokeColor: 'rgba(253, 180, 92, .3)',
                pointColor: 'rgba(253, 180, 92, .5)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(253, 180, 92, 1)',
                data: others
            }
        ]
    };
    
    return data;
}

/* chart options for line chart in TRENDS-view */
var trendOptions = {
    scaleFontSize: 10,
    scaleBeginAtZero: true,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
};

/* tests view chart */
function testTrendsChart(res) {
    res = getSortedResponse(res);
    
    var labels = [];
    var passed = [], failed = [], others = [];
    var passedCount = 0, othersCount = 0, failedCount = 0;

    for (var ix = 0; ix < res.length; ix++) {
        labels.push(new Date(res[ix][res[ix].length - 1].reportTime).toLocaleString());
        
        res[ix].forEach(function(item) {
            if (item._id === 'pass') { passedCount += item.count; }
            else if (item._id === 'fail' || item._id === 'fatal' ) { failedCount += item.count; }
            else if (item._id === 'skip' || item._id === 'warning' || item._id === 'error') { othersCount += item.count; }
        });

        passed.push(passedCount);
        failed.push(failedCount);
        others.push(othersCount);
        
        passedCount = 0, failedCount = 0, othersCount = 0;
    }
    
    var data = getTrendData(passed, failed, others, labels);

    var ctx = $('#test-trends').get(0).getContext('2d');
    new Chart(ctx).Line(data, trendOptions);
}

function getSortedResponse(res) {
    var times = [];
    
    // add times, to be sorted
    for (var ix = 0; ix < res.length; ix++) {
        times.push(new Date(res[ix][res[ix].length - 1].reportTime));
    }
    
    // sort times   
    times.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });
    
    // sort distribution by time
    var sortedResponse = [];
    for (t = 0; t < times.length; t++)
        for (var ix = 0; ix < res.length; ix++)
            if (new Date(times[t]).getTime() === new Date(res[ix][res[ix].length - 1].reportTime).getTime()) {
                sortedResponse.push(res[ix]);
                break;
            }
    
    return sortedResponse;
}

/* step view chart [TRENDS] */
function stepTrendsChart(res) {
    res = getSortedResponse(res);

    var labels = [];
    var passed = [], failed = [], others = [];
    var passedCount = 0, failedCount = 0, othersCount = 0;
    
    for (var ix = 0; ix < res.length; ix++) {
        
        labels.push(new Date(res[ix][res[ix].length - 1].reportTime).toLocaleString());

        res[ix].forEach(function(steps) {

            if (typeof steps !== 'undefined' && steps.length > 0)
                steps.forEach(function(step) {
                    if (step._id === 'pass') { passedCount += step.count; }
                    else if (step._id === 'fail' || step._id === 'fatal' ) { failedCount += step.count; }
                    else if (step._id === 'skip' || step._id === 'warning' || step._id === 'error') { othersCount += step.count; }
                });
        });
        
        
        passed.push(passedCount);
        failed.push(failedCount);
        others.push(othersCount);
        
        passedCount = 0, failedCount = 0, othersCount = 0;
    }

    var data = getTrendData(passed, failed, others, labels);

    var ctx = $('#step-trends').get(0).getContext('2d');
    new Chart(ctx).Line(data, trendOptions);
}
