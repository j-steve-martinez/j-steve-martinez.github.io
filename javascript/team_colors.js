/*
 * Name:          team_colors.js
 * Author:        J. Steve Martinez
 * Description:   Changes the colors based on team colors
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

$(document).ready(function(){
  // console.log('document ready says jquery');
  applyTeam();
  $(".icon").click(function(a){
    // console.log(a.currentTarget.id);
    // applyTeam(a.currentTarget.id);
    appendStyle(a.currentTarget.id)
  });
});
