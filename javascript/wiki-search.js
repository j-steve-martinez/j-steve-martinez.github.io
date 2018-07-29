/**
 * wiki-search.js
 */
// (function() {
$(document).ready(function () {
    console.log('document ready says jquery');

    $("#search").on("click", getContent);
    $("#storage").hide();
    $("#input").val("");
    $("input").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            //$("form").submit();
            getContent();
        }
    });
});


var idArray = new Array();
var myID = new Object();
var mySnippet = new Object();
var myURL = new Object();
//console.log("global object init: " + Object.keys(myObject));

function getID(query, search) {
    //console.log("geID query: " + query + "search string: " + search);
    if (query == undefined) {
        return;
    }
    var query = query;
    var search = search;

    var url = 'https://en.wikipedia.org/w/api.php';
    $.ajax({
        url: url,
        data: query,
        dataType: 'jsonp',
        type: 'POST',
        headers: {
            'Api-User-Agent': 'Example/1.0'
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log("getData jqXHR " + jqXHR);
            console.log("getData textStatus " + textStatus);
            console.log("getData Error " + errorThrown);
        },
        success: function (data) {
            //console.log('sucess:');
            //console.log(data);

            // do something with data
            var obj = new Object(data.query.pages);
            var key = Object.keys(obj);
            var id = {};
            key.forEach(function (val) {
                //console.log("title");
                //console.log(obj[val].title);
                var title = {
                    title: obj[val].title
                };

                id[val] = val;
                //console.log("id");
                //console.log(id[val]);
                id[val] = title;
                //console.log(id[val]);
            });

            //console.log("id:");
            //console.log(id);
            //console.log(obj[key]);

            // pass the data
            getSnippet(id, search);
            //console.log(url);
        }
    });
}

function getSnippet(id, search) {

    if (search == undefined) {
        return;
    }
    //console.log("getSnippet search string " + search);
    //console.log(id);

    //var id = id;
    //var search = search;

    // http://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=18630637&inprop=url

    var query = {
        action: "query",
        list: "search",
        srsearch: "",
        format: "json"
    };
    query.srsearch = $("#input").val();

    var url = 'https://en.wikipedia.org/w/api.php';
    $.ajax({
        url: url,
        data: query,
        dataType: 'jsonp',
        type: 'POST',
        headers: {
            'Api-User-Agent': 'Example/1.0'
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log("getData jqXHR " + jqXHR);
            console.log("getData textStatus " + textStatus);
            console.log("getData Error " + errorThrown);
        },
        success: function (data) {
            //console.log(data);

            var obj = new Object(data.query.search);
            var keys = Object.keys(obj);
            var idKeys = Object.keys(id);
            keys.forEach(function (key) {
                idKeys.forEach(function (idKey) {
                    //console.log(id[idKey].title);
                    //console.log(obj[key].title);
                    //console.log(obj[key].snippet);
                    if (id[idKey].title == obj[key].title) {
                        // add the snippet to the id object
                        id[idKey]["snippet"] = obj[key].snippet;
                    }
                });

            });

            //console.log("obj");
            //console.log(obj);
            //console.log(id);

            // pass the data
            getURL(id);

        }
    });
}

function getURL(id) {
    var keys = Object.keys(id);
    //console.log(keys);
    if (keys[0] == "action") {
        //console.log("action");
        return;
    }
    //console.log("getURL id object:");
    //console.log(id);
    // loop id here

    keys.forEach(function (key) {

        var url = 'https://en.wikipedia.org/w/api.php';

        var query = {
            action: "query",
            prop: "info",
            pageids: key,
            inprop: "url",
            format: "json"
        };

        $.ajax({
            url: url,
            data: query,
            dataType: 'jsonp',
            type: 'POST',
            headers: {
                'Api-User-Agent': 'Example/1.0'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log("getData jqXHR " + jqXHR);
                console.log("getData textStatus " + textStatus);
                console.log("getData Error " + errorThrown);
            },
            success: function (data) {
                //console.log("data: ");
                //console.log(data);
                var urlForID = data.query.pages[key].fullurl;
                //console.log(key);
                //console.log(urlForID);

                id[key]["url"] = urlForID;
                //console.log(id[key]);
                var title = id[key].title;
                var snippet = id[key].snippet;
                var url = id[key].url;
                //console.log(title);
                //console.log(url);
                //console.log(snippet);

                // update the html with the data
                var html = '<a href="' + url + '" class="list-group-item" target="_blank"><p>' + title + '</p>' + snippet + '</a>';
                $("#storage").append(html);

            }
        });

    });
    // show the data
    //$("#storage").show();
    $("#storage").fadeIn(3000);
    // clear the input
    $("#input").val("");
}

function getContent() {
    //console.log("getContent");
    var queryID = {
        action: "query",
        generator: "search",
        gsrsearch: "",
        format: "json"
    };

    // reset the list
    $("#storage").children().remove();

    // get the input
    queryID.gsrsearch = $("#input").val();

    //console.log(queryID.gsrsearch);

    // get the id of input from wiki
    getID(queryID, $("#input").val());
}

// })();