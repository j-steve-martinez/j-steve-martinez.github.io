/**
 * This is the bootstrap for the site
 */

"use strict";

/**
 * DOM ready
 */

window.onload = () => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "/javascript/tic_tac_toe.js";
    document.body.appendChild(script);
}

  