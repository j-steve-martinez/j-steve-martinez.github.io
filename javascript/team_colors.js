/*
 * Name:          team_colors.js
 * Author:        J. Steve Martinez
 * Description:   Changes the colors based on team colors
 */

function appendStyle(team) {
  var css = document.createElement('style');
  css.type = 'text/css';
  
  var niners_styles = '.site-header { background: #ac0000;}';
  niners_styles += ' body { background: gold; }';
  niners_styles += ' a.site-title { color: gold !important;}';
  niners_styles += ' .page-link { color: gold !important;}';

  var giants_styles = '.site-header { background: black;}';
  giants_styles += ' body { background: #fffce3; }';
  giants_styles += ' a.site-title { color: #fe5a1d !important;}';
  giants_styles += ' .page-link { color: #fe5a1d !important;}';

  var warriors_styles = '.site-header { background: #0120b9;  }';
  warriors_styles += ' body { background: #efd812; }';
  warriors_styles += ' a.site-title { color: #efd812 !important;}';
  warriors_styles += ' .page-link { color: #efd812 !important;}';

  var sharks_styles = '.site-header { background: #007889; }';
  sharks_styles += ' body { background: #FFFFFF }';
  sharks_styles += ' a.site-title { color: white !important;}';
  sharks_styles += ' .page-link { color: white !important;}';

  var athletics_styles = '.site-header { background: green;}';
  athletics_styles += ' body { background: yellow; }';
  athletics_styles += ' a.site-title { color: yellow !important;}';
  athletics_styles += ' .page-link { color: yellow !important;}';

  var raiders_styles = '.site-header { background: black;}';
  raiders_styles += ' body { background: silver; }';
  raiders_styles += ' a.site-title { color: silver !important;}';
  raiders_styles += ' .page-link { color: silver !important;}';

  var jekyll_styles = '.site-header { background: white;}';
  jekyll_styles += ' body { background: white; }';
  jekyll_styles += ' a.site-title { color: black !important;}';
  jekyll_styles += ' .page-link { color: black !important;}';


  if ( team=="warriors")    {var styles = warriors_styles;}
  if ( team=="niners")      {var styles = niners_styles;}  
  if ( team=="giants")      {var styles = giants_styles;} 
  if ( team=="sharks")      {var styles = sharks_styles;}
  if ( team=="athletics")   {var styles = athletics_styles;}
  if ( team=="raiders")     {var styles = raiders_styles;}
  if ( team=="jekyll")      {var styles = jekyll_styles;}

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  document.getElementsByTagName("head")[0].appendChild(css);
  document.getElementById("team_header").innerHTML = team;
  document.getElementById("team_footer").innerHTML = team.toUpperCase();
  document.getElementById("team-image").src = "/images/"+team+".png";
  document.getElementById("team-image").alt = team.toUpperCase();
  
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