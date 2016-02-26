$(document).ready(function() {
    $('select.dropdown').dropdown();
});

$('.menu-toggle').click(function() {
    $('.ui.sidebar').toggleClass('docked');
});

$('.view-report').click(function() {
    $('input#report-id').attr('value', $(this).attr('report-id'));
    $('form#report-detail').submit();
});

function clearForm(elem) {
    var form = $(elem).closest('form');
    form.find('input[type=text], textarea').val('');
}

