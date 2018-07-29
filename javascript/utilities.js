/*
 * Name:          utilities.js
 * Author:        J. Steve Martinez
 * Description:   site stuff
 */

function appendStyle(team) {
  if (document.getElementById("team-image")){
    document.getElementById("team-image").src = "/images/"+team+".png";
    document.getElementById("team-image").alt = team.toUpperCase();
  }
  $("body").attr('class', team);
  setCookie("teamname", team, 30);
}

function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname+"="+cvalue+"; "+"path=/; "+expires;
  
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) != -1) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function applyTeam() {
  var team=getCookie("teamname");
  if (team != "") {
    appendStyle(team);
  }
}

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

$(document).ready(function(){
  // console.log('document ready says jquery');
  applyTeam();
  updateLink();
  $(".icon").click(function(a){
    // console.log(a.currentTarget.id);
    // applyTeam(a.currentTarget.id);
    $("button").blur();
    appendStyle(a.currentTarget.id)
  });
});
