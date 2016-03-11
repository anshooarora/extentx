$(document).ready(function() {
    $('.datepicker').datepicker();
    $('select.dropdown').dropdown();
});

$('#expand-sidenav').click(function() {
    $(this).children('i').toggleClass('fa-arrow-circle-o-right fa-arrow-circle-o-left');
    $('.side-nav').toggleClass('expanded');
    $('.container.main, .ui.top.menu').toggleClass('padded');
    
    var items = $('.side-nav .item-name');
    if (items.eq(0).hasClass('hidden')) {
        setTimeout(function() {
            items.removeClass('hidden');
        }, 150);
    } else {
        items.addClass('hidden');
    }
});

$('.view-report').click(function() {
    $('input#report-id').attr('value', $(this).attr('report-id'));
    $('form#report-detail').submit();
});

function clearForm(elem) {
    var form = $(elem).closest('form');
    form.find('input[type=text], textarea').val('');
}

