/**
 * This is the bootstrap for the site
 */

"use strict";

/**
 * Modify the theme link
 * Insert custom select option for colors
 */
function updateLink(e){
    // console.log(e.currentTarget.id);

    // Get the Elemenet to be replaced
    var nChild = document.getElementById("Theme");

    // Get the parent node
    var nParent = nChild.parentNode;

    // Create a replacement element
    var nReplacment = document.createElement("div");
    
    // Give it an id
    nReplacment.id = "Theme";
    nReplacment.className = "page-link dropdown";
    nReplacment.href = "#";
    
    // Create the a link
    var themeLink = document.createElement("a");
    themeLink.className = "page-link";
    themeLink.href = nChild.href;
    
    // Create some content for the link
    var eContent = document.createTextNode("Themes");
    themeLink.appendChild(eContent);

    /**
     * TODO: make ajax call to get list
     */
    // Create sub elements for each theme
    var themes = [
        "warriors",
        "niners",
        "giants", "sharks", "raiders", "athletics"
    ];
    
    var dropdown = document.createElement("div");
    dropdown.className = "trigger dropdown-content";
    themes.forEach(theme => {
        // console.log(theme);
        var themeIcon = document.createElement("div");
        themeIcon.className = "dropbtn";
        themeIcon.innerText = theme;
        themeIcon.id = theme;
        dropdown.appendChild(themeIcon);
    });

    // Add the content to the element
    nReplacment.appendChild(themeLink);
    nReplacment.appendChild(dropdown);

    // Replace the node
    nParent.replaceChild(nReplacment, nChild);

    $(".dropbtn").click(function(e){
        // console.log("dropbtn click");
        // console.log(e.currentTarget.id);
        appendStyle(e.currentTarget.id);
    });
}

function main() {
    console.log('main ready');
    updateLink();
    ticTacToe();
    // $("#Theme").click(updateLink);
}

/**
 * DOM ready
 */
$(document).ready(main);


  