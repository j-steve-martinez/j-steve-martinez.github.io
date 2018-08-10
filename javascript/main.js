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
    // setHtml("simon");
}

function setHtml() {
    /**
     * get the root element
     */
    var root = document.getElementById("simon");
    root.innerText = "";

    /**
     * Add big buttons
     */
    var bigButtons = {
        1: "quarter quarter-tl",
        2: "quarter quarter-tr",
        3: "quarter quarter-bl",
        4: "quarter quarter-tr"
    }
    var bigBtnWrap = document.createElement("div");
    Object.entries(bigButtons).forEach((arrayS, count) => {
        // console.log(arrayS[0]);
        // console.log(arrayS[1]);
        // console.log(count);
        // console.log(y);
        var tmp = document.createElement("div");
        tmp.id = arrayS[0];
        tmp.className = arrayS[1];
        bigBtnWrap.appendChild(tmp);
    });


    var ctrlBtns = {
        "start-c": "small-circle",
        "strict-c": "small-circle",
        "reset-c": "small-circle",
        "start": "label",
        "strict": "label",
        "reset": "label",
        "power": "none",
        "power-label": "none",
        "counter": "none"
    }
    var ctrlBtnsWrap = document.createElement("div");
    Object.entries(ctrlBtns).forEach((arrayS, count) => {
        // console.log(arrayS[0]);
        // console.log(arrayS[1]);
        // console.log(count);
        
        var tmp = document.createElement("div");
        tmp.id = arrayS[0];
        tmp.className = arrayS[1];
        if (arrayS[1] == "label") {
            tmp.innerText = arrayS[1].toUpperCase();
        }
        if (arrayS[0] == "counter") {
            tmp.innerText = "--";
        }
        ctrlBtnsWrap.appendChild(tmp);
    });
    root.appendChild(ctrlBtnsWrap);
    root.appendChild(bigBtnWrap);
}