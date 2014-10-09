---
layout: post
title:  Messin with JSON
date:   2014-10-06 11:44:48
categories: scripting
---

Just thought I would implement a bit of javascript using [JSON (javascript object notation)][json].

So I headed over to [w3schools][w3] to get an example.

{% highlight javascript %}
<div id="id01"></div>

<script>
var xmlhttp = new XMLHttpRequest();
var url = "myTutorials.txt";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' +
        arr[i].display + '</a><br>';
    }
    document.getElementById("id01").innerHTML = out;
}
</script>
{% endhighlight %}

I created 2 files json.txt and json.html in a folder called examples/json.

I updated the script above to rename myTutorial.txt to json.txt and added the data in the text file.

{% highlight java %}
[
{"display": "JSON"              ,"url": "http://json.org"},
{"display": "JSON in Java"      ,"url": "http://www.json.org/java/index.html"},
{"display": "Python simpleJSON" ,"url": "https://pypi.python.org/pypi/simplejson/"}
]
{% endhighlight %}

Using the Jekyll [YAML][yaml] templates, I just put the snippet below at the top of the json.html page:

{% highlight ruby %}
---
layout: page
title:  Messin with JSON
---
{% endhighlight %}

Then added the json script from above. And `pow`!

You get a nicly formatted page with some scripting embedded as you can see [here][example].

[yaml]:      http://yaml.org/
[example]:	{{ "/examples/json/json.html" | prepend: site.baseurl }}
[w3]:				http://www.w3schools.com/json/json_http.asp
[json]:			http://json.org
