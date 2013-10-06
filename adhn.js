// ==UserScript==
// @name        ADHN
// @namespace   http://lukechampine.com
// @description Adds inline article summaries to the HN front page
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require     http://courses.ischool.berkeley.edu/i290-4/f09/resources/gm_jq_xhr.js
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @version     1.2
// ==/UserScript==

// Big thanks to clipped.me for the API!

$(".title:has(.comhead)").each(function() {
    var link = $(this).children("a").attr("href");
    var subrow  = $(this).parent().next().children(".subtext");
    // add text
    subrow.append(" | <span class=\"sumid\">summary</span>");
    var sumid = subrow.children(".sumid");
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
        subrow.append("<div class=\"sumtext\">loading...</div>");
        $.ajax({
            url: "http://clipped.me/algorithm/clippedapi.php?url=" + link,
            dataType: "json",
            success: function(result) { subrow.children(".sumtext").text(result.summary.join(" ")); },
            error: function() { subrow.children(".sumtext").text("Unable to generate a summary for this content -- sorry!"); }
        });
    });
    // on subsequent clicks, toggle the summary
    sumid.toggle(function() {
        subrow.children(".sumtext").fadeIn("medium");
    }, function() {
        subrow.children(".sumtext").fadeOut("medium");
    });
});