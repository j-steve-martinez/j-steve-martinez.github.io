$(document).ready(function () {

    var quote,
        author;


    $("#getQuote").on("click", getRandomQuote);

    getRandomQuote();
    updateTwitter();

    function updateTwitter(message) {
        twttr.ready(function (twttr) {
            var share_url = 'http://codepen.io/j_steve_m/full/KzdZgm/';
            var message = quote + " By " + author;
            //$("#twitter1").html('&nbsp;');
            $("#twitter1").html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + share_url + '" data-size="large" data-text="' + message + '" data-count="none">Tweet</a>');
            twttr.widgets.load();
        });
    }

    // Get a random quote
    function getRandomQuote() {
        'use strict';
        $.ajax({
            url: 'https://api.forismatic.com/api/1.0/',
            jsonp: "jsonp",
            dataType: 'jsonp',
            data: {
                method: "getQuote",
                lang: "en",
                format: "jsonp"
            },
            error: function () {
                $("div1").html("<h1>ERROR</h1>");
                console.log('error');
            },
            success: function (result) {
                //quotes = result;
                //console.log("getRandomQuote: " + result);
                quote = result.quoteText;
                author = result.quoteAuthor;
                if (!author) {
                    author = "Unknown";
                }
                $("#quote").html("<q> " + quote + " </q>");
                $("#author").html(author);
                updateTwitter();
            }
        });
    }

});