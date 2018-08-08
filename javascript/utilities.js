/*
 * Name:          utilities.js
 * Author:        J. Steve Martinez
 * Description:   site stuff
 */

function appendStyle(team) {
  if (document.getElementById("team-image")) {
    document.getElementById("team-image").src = "/images/themes/" + team + ".svg";
    document.getElementById("team-image").alt = team.toUpperCase();
  }
  $("body").attr('class', team);
  setCookie("teamname", team, 30);
}

function setCookie(cName, cValue, cTime, cType) {
  /**
   * set session if no time
   */
  if (cTime !== undefined) {
    /**
     * set max-age or expires
     */
    if (cType !== undefined) {
      /**
       * max-age * cTime * 1-minute
       */
      var expires = "max-age=" + (cTime*60);
    } else {
      /**
       * expires * cTime * 1-day
       */
      var d = new Date();
      d.setTime(d.getTime() + (cTime * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toGMTString();
    }
  } else {
    /**
     * Set as a session cookie
     */
    var expires = "";
  }
  document.cookie = cName + "=" + cValue + "; " + "path=/;" + expires;
}

function getCookie(cName) {
  var name = cName + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function applyTeam() {
  var team = getCookie("teamname");
  if (team != "") {
    appendStyle(team);
  }
}

/**
 * Modify the theme link
 * Insert custom select option for colors
 */
function updateLink(e) {
  // console.log(e.currentTarget.id);

  // Get the Elemenet to be replaced
  var nChild = document.getElementById("Theme");

  // Get the parent node
  var nParent = nChild.parentNode;

  /**
   * TODO: make ajax call to get list
   */
  // Create sub elements for each theme
  var themes = [
    "warriors", "niners", "giants",
    "sharks", "raiders", "athletics"
  ];

  var dropdown = document.createElement("div");
  dropdown.className = "page-link-content";
  themes.forEach(theme => {
    // console.log(theme);
    var themeIcon = document.createElement("div");
    themeIcon.className = "page-link theme";
    themeIcon.innerText = theme;
    themeIcon.id = theme;
    dropdown.appendChild(themeIcon);
  });

  // Replace the node
  nParent.appendChild(dropdown);

  $(".theme").click(function (e) {
    // console.log("page-link-content theme click");
    // console.log(e.currentTarget.id);
    appendStyle(e.currentTarget.id);
  });

}

$(document).ready(function () {
  // console.log('document ready says jquery');
  $(".theme-icon").click(function (a) {
    // console.log('theme icon click');
    // console.log(a.currentTarget.id);
    appendStyle(a.currentTarget.id)
  });
  applyTeam();
  updateLink();
});