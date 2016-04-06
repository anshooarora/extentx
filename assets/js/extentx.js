$('#expand-sidenav').click(function() {
    $(this).children('i').toggleClass('fa-arrow-circle-o-right fa-arrow-circle-o-left');
    $('.side-nav').toggleClass('expanded');
    $('.container.main, .navbar').toggleClass('padded');
    
    var items = $('.side-nav .item-name');
    if (items.eq(0).hasClass('hidden')) {
        setTimeout(function() {
            items.removeClass('hidden');
        }, 150);
    } else {
        items.addClass('hidden');
    }
});