/**
 * This is the bootstrap for the site
 */

"use strict";
/**
 * DOM ready
 */

window.onload = () => {
    // var script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = "/javascript/tic_tac_toe.js";
    // document.body.appendChild(script);
    setHtml("main");
    animate("content");
}

function setHtml(id) {
    /**
     * get the root element
     // var root = document.getElementsByTagName("body")["0"];
     */
    var root = document.getElementById(id);
    root.innerText = "";

    /**
     * Add Content
     */
    var contents = {
        "welcome": "page-header",
        "content": "page-content"
    }
    var content = document.createElement("div");
    Object.entries(contents).forEach((entries, count) => {
        // console.log(entries[0]);
        // console.log(entries[1]);
        // console.log(count);
        // console.log(y);
        var element = document.createElement("div");
        element.id = entries[0];
        element.className = entries[1];
        if (entries[0] == "welcome") {
            element.innerText = "Welcome";
        }
        content.appendChild(element);
    });
    root.appendChild(content);
}