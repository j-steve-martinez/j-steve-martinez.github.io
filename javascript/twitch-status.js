/*
 User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.
 User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.
 User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.
 User Story: I will see a placeholder notification if a streamer has closed their Twitch account (or the account never existed).
 You can verify this works by adding brunofin and comster404 to your array of Twitch streamers.
 twitch client id: eb4svq23ayn4ldow0gkszcrq3b0fsh
 */
(() => {
    'use strict';
    $(document).ready((e) => {
        // console.log('jquery says ready');
        main();
    });
    function main() {
        // console.log("main");

        setPage();
        $("#online").hide();
        $("#offline").hide();
        getUsers();
        // set click handlers for tab controlls
        $("#tab-all").click((e) => {
            // console.log(e);
            $("#offline").hide();
            $("#online").hide();
            $("#all").show();
            $("#tab-all").attr("class", "selected");
            $("#tab-online").attr("class", "");
            $("#tab-offline").attr("class", "");
        });
        $("#tab-online").click((e) => {
            // console.log(e);
            $("#all").hide();
            $("#offline").hide();
            $("#online").show();
            $("#tab-online").attr("class", "selected");
            $("#tab-all").attr("class", "");
            $("#tab-offline").attr("class", "");

        });
        $("#tab-offline").click((e) => {
            // console.log(e);
            $("#all").hide();
            $("#online").hide();
            $("#offline").show();
            $("#tab-offline").attr("class", "selected");
            $("#tab-all").attr("class", "");
            $("#tab-online").attr("class", "");

        });
    }
    function setPage(){
    /**
     * get the root element
     // var root = document.getElementsByTagName("body")["0"];
     */
    var root = document.getElementById('twitch-status');
    root.innerText = "";
    root.className = "wrapper";

    /**
     * Add Content
     */
    var contents = {
        "tab-all": ["", "All"],
        "tab-online": ["", "Online"],
        "tab-offline": ["", "Offline"],
        "all": ["list-group", ""],
        "online": ["list-group", ""],
        "offline": ["list-group", ""],
    }
    var content = document.createElement("div");
    content.className = "twitch-users"
    var control = document.createElement("div");
    control.className = "twitch-control"
    Object.entries(contents).forEach((entries, count) => {
        // console.log(entries[0]);
        // console.log(entries[1]);
        // console.log(count);
        var child;
        switch (entries[1][0]) {
            case "":
                child = document.createElement("button");
                child.id = entries[0];
                child.className = entries[1][0];
                child.innerText = entries[1][1];
                control.appendChild(child);
                break;
            case "list-group":
                child = document.createElement("div");
                child.id = entries[0];
                child.className = entries[1][0];
                child.innerText = entries[1][1];
                content.appendChild(child);
                break;
            default:
                break;
        }
    });
    root.appendChild(control);
    root.appendChild(content);
    // console.log(root);
    }
    function getUsers(status) {
        'use strict';
        var users = [
            "sco",
            "AtheneLIVE", 
            "freecodecamp", 
            "Asmongold", 
            "terakilobyte", 
            "RiotGamesBrazil", 
            "RobotCaleb", 
            "sodapoppin", 
            "noobs2ninjas", 
            "beohoff", 
            "brunofin",
            "TSM_Daequan",
            "TSM_Myth"
        ];
        //var user = users[0];
        users.forEach(function (user) {
            // console.log(user);
            var userInfo;
            $.getJSON('https://wind-bow.gomix.me/twitch-api/users/' + user + '?callback=?').then(function (data) {
                // console.log("getUsers");
                // console.log(data);
                // console.log(data.error);
                // make an object
                var name, url, logo, bio, userInfo;

                url = 'https://www.twitch.tv/';

                // check if user exists
                if (data.error != undefined) {
                    // console.log('no user');
                    name = user + " has no account."
                    bio = "";
                    url = "#";
                } else {
                    name = data.display_name;
                    bio = data.bio;
                    url += name;
                    if (bio === null) {
                        bio = "";
                    }
                }
                // set empty logo with generic
                data.logo != null ? logo = data.logo : logo = "/images/misc/person.png";

                userInfo = {
                    name: name,
                    url: url,
                    logo: logo,
                    bio: bio
                };
                getStream(userInfo);
            });
        });
    }
    function getStream(user) {
        'use strict';
        //console.log(user.name);
        $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + user.name + '?callback=?').then(function (data) {
            // console.log("getStream: ");
            // console.log(data);
            var status = data.stream;
            var classname,
                statusText;
            status == null ? classname = "offline" : classname = "online";
            status == null ? statusText = "Status: OFFLINE" : statusText = "Status: ONLINE";

            // update the html with the data
            var html = '<a href="' + user.url + '" class="list-group-item ' + classname + '" target="_blank"><img src="' + user.logo + '" alt=":-)"/>  <div>' + user.name + '</div><div>' + statusText + '</div>' + '</a>';
            // console.log(html);
            if (data.status == 422) {
                //console.log("nonexist");
                html = '<a href="#" class="list-group-item nonexist">' + user.name + '<div>Account Closed</div></a>';
                $("#all").append(html);
                return;
            } else if (status == null) {
                //add user to offline tab
                $("#offline").append(html);
            } else {
                //add user to online
                var stream = data._links.channel;
                var followers = data.stream.channel.followers;
                var game = data.stream.game;
                //console.log("followers");
                //console.log(followers);
                html = html.slice(0, -4);
                html += '<div>Followers: ' + followers + '</div><div>Game: ' + game + '</div></a>';
                //console.log(html);
                $("#online").append(html);
            }

            $("#all").append(html);
            sortAll();
        });
    }
    function sortAll() {
        var elem = $('#all').find('a').sort((a, b) => {
            return a.className < b.className;
        });
        $('#all').append(elem);
    }
})();