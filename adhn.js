// ==UserScript==
// @name        ADHN
// @namespace   http://lukechampine.com
// @description Adds inline article summaries to the HN front page
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require     http://courses.ischool.berkeley.edu/i290-4/f09/resources/gm_jq_xhr.js
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @version     1.6
// ==/UserScript==

// Big thanks to clipped.me for the API!

// individual posts summaries
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
        subrow.append("<div class=\"sumtext\" visible=\"false\">loading...</div>");
        $.ajax({
            url: "http://clipped.me/algorithm/clippedapi.php?url=" + link,
            dataType: "json",
            success: function(result) { subrow.children(".sumtext").html(result.summary.join("<br>")); },
            error: function() { subrow.children(".sumtext").text("Unable to generate a summary for this content -- sorry!"); }
        });
    });
    // on subsequent clicks, toggle the summary
    sumid.click(function() {
        if (subrow.children(".sumtext").attr("visible") == "false") {
            subrow.children(".sumtext").fadeIn("medium");
            subrow.children(".sumtext").attr("visible", "true");
        }
        else {
            subrow.children(".sumtext").fadeOut("medium");
            subrow.children(".sumtext").attr("visible", "false");
        }
    });
});

// expand/collapse all
// text
$(".pagetop").append(" | <span class=\"sumall\">summarize all</span>");
// mouseover effects
$(".sumall").hover(function() {
    $(this).css("cursor", "pointer");
}, function() {
    $(this).css("cursor", "auto");
});
// first click
$(".sumall").one("click", function() {
    $(".sumid").each(function() {
        $(this).trigger("click");
    });
});
// subsequent clicks
$(".sumall").toggle(function() {
    $(this).text("hide summaries");
    $(".sumtext").each(function() {
        $(this).fadeIn("medium");
        $(this).attr("visible", "true");
    });
}, function() {
    $(this).text("summarize all");
    $(".sumtext").each(function() {
        $(this).fadeOut("medium");
        $(this).attr("visible", "false");
    });
});