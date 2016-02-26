$(document).ready(function() {
    /* 
    * creates charts for Analysis -> Dashboard page
    */ 
    createAnalysisDashboardCharts();
});

function createAnalysisDashboardCharts() {
    if (!$('#dashboard-test-analysis') || $('#dashboard-test-analysis').length === 0) return;

    $.ajax({
        method: 'get',
        data: {
            limit: 5
        },
        url: '/reportDistribution',
    }).done(function(res) {
        dashboardTestAnalysis(res.testDistribution);
    });
}

/* dashboard chart options [DASHBOARD] */
var chartOptions = {
	segmentShowStroke : false, 
	percentageInnerCutout : 55, 
	animationSteps : 25,
	legendTemplate : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
};

/* tests view chart */
function dashboardTestAnalysis(res) {
    var pass = 0, fail = 0, fatal = 0, error = 0, warning = 0, skip = 0, unknown = 0;

    for (var ix = 0; ix < res.length; ix++) {
        res[ix].forEach(function(item) {

            switch (item._id) {
                
                case 'pass':
                    pass += item.count;
                    break;
                
                case 'fail':
                    fail += item.count;
                    break;
                    
                case 'fatal':
                    fatal += item.count;
                    break;
                    
                case 'error':
                    error += item.count;
                    break;
                    
                case 'warning':
                    warning += item.count;
                    break;
                    
                case 'skip':
                    skip += item.count;
                    break;
                
                case 'unknown':
                    unknown += item.count
                    break;
                
                default:
                    break;
            }
            
        });
    }
    
    var data = [
		{ value: pass, color: '#00af00', highlight: '#32bf32', label: 'Pass' },
		{ value: fail, color:'#F7464A', highlight: '#FF5A5E', label: 'Fail' },
		{ value: fatal, color:'#8b0000', highlight: '#a23232', label: 'Fatal' },
		{ value: error, color:'#ff6347', highlight: '#ff826b', label: 'Error' },
		{ value: warning, color: '#FDB45C', highlight: '#FFC870', label: 'Warning' },
		{ value: skip, color: '#1e90ff', highlight: '#4aa6ff', label: 'Skip' },
		{ value: unknown, color: '#222', highlight: '#444', label: 'Unknown' }
	];
    
    var ctx = $('#dashboard-test-analysis').get(0).getContext('2d');
    var testChart = new Chart(ctx).Doughnut(data, chartOptions);
    drawLegend(testChart, 'dashboard-test-analysis');
}

/* draw legend for test and step charts [DASHBOARD] */
function drawLegend(chart, id) {
    var helpers = Chart.helpers;
    var legendHolder = document.getElementById(id);
    
    legendHolder.innerHTML = chart.generateLegend();
    
    helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index) {
        helpers.addEvent(legendNode, 'mouseover', function() {
            var activeSegment = chart.segments[index];
            activeSegment.save();
            activeSegment.fillColor = activeSegment.highlightColor;
            chart.showTooltip([activeSegment]);
            activeSegment.restore();
        });
    });
    
    Chart.helpers.addEvent(legendHolder.firstChild, 'mouseout', function() {
        chart.draw();
    });

    $('#' + id).after(legendHolder.firstChild);
}
