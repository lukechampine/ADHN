// ==UserScript==
// @name        ADHN
// @namespace   http://lukechampine.com
// @description Adds inline article summaries to the HN front page
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require     http://courses.ischool.berkeley.edu/i290-4/f09/resources/gm_jq_xhr.js
// @include     http://news.ycombinator.com/news
// @include     https://news.ycombinator.com/news
// @version     1.0
// ==/UserScript==

// Big thanks to clipped.me for the API!

$(".title:has(.comhead)").each(function() {
    var link = $(this).find("a").attr("href");
    var subrow  = $(this).parent().next().find(".subtext");
    // add text
    subrow.append(" | <span class=\"sumid\">summary</span>");
    var sumid = subrow.find(".sumid");
    // add mouseover effects
    sumid.hover(function() {
        $(this).css("text-decoration", "underline");
        $(this).css("cursor", "pointer");
    }, function() {
        $(this).css("text-decoration", "none");
        $(this).css("cursor", "auto");
    });
    // load the summary on the first click (and only the first click)
    sumid.one("click", function() {
        $.ajax({
            url: "http://clipped.me/algorithm/clippedapi.php?url=" + link,
            dataType: "json",
            success: function(result) { sumid.parent().append("<div class=\"sumtext\">" + result.summary.join(' ')) + "</div>"; },
            error: function() { sumid.parent().append("<div class=\"sumtext\">Unable to generate a summary for this content -- sorry!</div>"); }
        });
    });
    // on subsequent clicks, toggle the summary
    sumid.toggle(function() {
        subrow.find(".sumtext").css("display", "");
    }, function() {
        subrow.find(".sumtext").css("display", "none");
    });
});