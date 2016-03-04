$(document).ready(function() {
    if ($('.search-view').length === 1) {
        execSearchPageScripts();
    }
});

function execSearchPageScripts() {
    $('.test-content').removeClass('hidden');
}