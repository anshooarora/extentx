const usedWidth = 480;

$(document).ready(function() {
    setDetailsViewContrainerWidths();
    initializeTest();
    
    var tbody = $('table.history > tbody');
    for (var ix = 0; ix < tbody.length; ix++) {
        var t = tbody.eq(ix);
        (t.find('tr').length == 0) && (t.parent().html(''));
    }
});

$(window).resize(function() {
    setDetailsViewContrainerWidths();
});

function initializeTest() {
    if (!$('.details-view') || $('.details-view').length === 0) return;
    
    $('.test:first-child').click();
}

function setDetailsViewContrainerWidths() {
    if (!$('.details-view') || $('.details-view').length === 0) return;
    
    var freeWidth = $(document).width() - usedWidth;
    
    if ($('.details-view .ui.segment.historical-details').hasClass('hidden')) {
        $('.details-view .ui.segment.current-details').css('width', freeWidth);
    }
    else {
        $('.details-view .ui.segment.current-details, .details-view .ui.segment.historical-details').css('width', (freeWidth / 2));
        $('.details-view .ui.segment.historical-details').css('left', usedWidth + (freeWidth / 2) - 10);
    }
}

$('#test-collection .test').click(function() {
    $('#test-collection .test').removeClass('active');
    
    var t = $(this);
    var d = $('.current-details');
    
    t.addClass('active');
    
    $('.details-view .ui.segment.historical-details').addClass('hidden');
    setDetailsViewContrainerWidths();
    
    var testName = t.find('.test-name').html();
    var testContent = t.find('.test-content').clone();
    
    d.find('.test-name').html(testName);
    d.find('.cloned-content').html('').append($(testContent).removeClass('hidden'));
});

$('.details-view .current-details').click(function(evt) {
    var t = $(evt.target);
        
    if (t.is('.history-link')) {
        $('table.history tr').removeClass('warning');
        t.closest('tr').addClass('warning');
        
        $('.details-view .ui.segment.historical-details').removeClass('hidden');
        setDetailsViewContrainerWidths();
        
        var testName = $('.current-details').find('.test-name').html();
        var historyContent = t.nextAll('.history-content').first().clone();
        
        var h = $('.historical-details');
        
        h.find('.test-name').html(testName);
        h.find('.cloned-content').html('').append($(historyContent).removeClass('hidden'));
    }
});