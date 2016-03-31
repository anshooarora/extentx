angular.module('ExtentX').    
    factory('PieChartSettings', function() {
        var options = {
            segmentShowStroke : false, 
            percentageInnerCutout : 55,
            animationEasing: 'linear', 
            animationSteps : 15,
            legendTemplate : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };
        var colors = [ '#00af00', '#F7464A', '#8b0000', '#ff6347', '#FDB45C', '#1e90ff', '#222' ];
        
        return {
            options: options,
            colors: colors
        }
    });
