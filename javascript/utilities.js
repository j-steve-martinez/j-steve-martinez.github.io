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
            var expires = "max-age=" + (cTime * 60);
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
        themeIcon.className = "page-link-list theme";
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

/**
 * Create node/links for <a> tags
 */
function getData(type) {
    /**
     * Test Data
     */
    // var graph = {
    //     "nodes" : [
    //         {"id": "Myriel", "group": 1},
    //         {"id": "Napoleon", "group": 1},
    //         {"id": "Mlle.Baptistine", "group": 1},
    //         {"id": "Mme.Magloire", "group": 1},
    //         {"id": "CountessdeLo", "group": 1},
    //         {"id": "Geborand", "group": 1},
    //         {"id": "Champtercier", "group": 1},
    //         {"id": "Cravatte", "group": 1},
    //         {"id": "Count", "group": 1},
    //         {"id": "OldMan", "group": 1},
    //         {"id": "Labarre", "group": 2},
    //         {"id": "Valjean", "group": 2},
    //         {"id": "Marguerite", "group": 3}
    // ],
    //     "links" : [
    //         {"source": "Napoleon", "target": "Myriel", "value": 1},
    //         {"source": "Mlle.Baptistine", "target": "Myriel", "value": 1},
    //         {"source": "Mme.Magloire", "target": "Myriel", "value": 1},
    //         {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 1},
    //         {"source": "CountessdeLo", "target": "Myriel", "value": 1},
    //         {"source": "Geborand", "target": "Myriel", "value": 1},
    //         {"source": "Champtercier", "target": "Myriel", "value": 1},
    //         {"source": "Cravatte", "target": "Myriel", "value": 1},
    //         {"source": "Count", "target": "Myriel", "value": 2},
    //         {"source": "OldMan", "target": "Myriel", "value": 1},
    //         {"source": "Valjean", "target": "Labarre", "value": 1},
    //         {"source": "Valjean", "target": "Mme.Magloire", "value": 3},
    //         {"source": "Valjean", "target": "Marguerite", "value": 3}
    //     ]
    // }

    if (type == "date") {
        // console.log('date');
        var data = {},
            nodes = [],
            links = [];
        var newDate = new Date().toString().replace(/\(/, "").replace(/\)/, "").replace(/\-/, " ").split(" ");
        // console.log(new Date().toString().replace(/\(/, "").replace(/\)/, ""));
        newDate.forEach((curVal, index, ary) => {
            var node = {},
                link = {};
            node.id = curVal;
            node.group = index;
            nodes.push(node);
            switch (index) {
                case 0:
                    // console.log('no link on first 0');
                    break;
                default:
                    link.source = ary[index];
                    link.target = ary[(index - 1)];
                    link.value = 0;
                    links.push(link);
                    break;
            }
        });
        data.links = links;
        data.nodes = nodes;
    } else {
        var allLinks = document.getElementsByTagName("a");
        var nodes = [],
            menuNum = 0;
        for (const element of allLinks) {

            /**
             * make some node
             */
            var node = {};
            switch (element.className) {
                case 'site-title':
                    node.id = "Sweet Home";
                    node.group = "1";
                    break;
                case 'menu-icon':
                    menuNum += 1;
                    node.id = "menu-" + menuNum;
                    node.group = "2";
                    break;
                case 'page-link-btn':
                    node.id = element.id;
                    node.group = "3";
                    break;
                case 'page-link-list':
                    node.id = element.id;
                    node.group = "4";
                    break;
                default:
                    node.id = element.id;
                    node.group = "5";
                    break;
            }
            if (node.id) {
                nodes.push(node);
            }
            // console.log(node);
        }
        // console.log(nodes);
        var links = [];
        for (const node of nodes) {
            var link = {};
            // console.log(node);
            switch (node.group) {
                case "2":
                    link.source = node.id;
                    link.target = "Sweet Home";
                    link.value = 1;
                    break;
                case "3":
                    link.source = node.id;
                    link.target = "menu-1";
                    link.value = 1;
                    break;
                case "4":
                    link.source = node.id;
                    link.target = "Projects";
                    link.value = 1;
                    break;
                case "5":
                    link.source = node.id;
                    link.target = "menu-2";
                    link.value = 5;
                    break;
                default:
                    break;
            }
            if (link.source) {
                links.push(link);
            }
        }

        var data = {};
        data.nodes = nodes;
        data.links = links;
    }
    // console.log('data: ');
    // console.log(data);
    return data;
}

function animate(id) {
    /**
     * Date SVG
     */
    if (id == undefined) {
        return;
    } else {
        var id = "#" + id;
    }
    var box = {
        'width': 100,
        'height': 10
    };
    var graph = getData("date");

    var main = d3.select(id);
    var width = main["_groups"][0][0].clientWidth;
    var height = width / 3;
    if (width < 300) {
        width = 300;
        height = 200;
    }
    main.append('svg')
        .attr('id', "date-svg")
        .attr("width", width)
        .attr("height", height);

    var svg = d3.select("#date-svg");
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide((d) => {
            var force = 5;
            return force;
        }));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", (d) => {
            return 5;
        })
        .attr("fill", function (d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var junk = svg.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "text")
        .text((d) => {
            return d.id;
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
        node
            .attr("cx", function (d) {
                // console.log("d.x " + d.x);
                // return d.x;
                return d.x = Math.max(1, Math.min(width - 75, d.x));
            })
            .attr("cy", function (d) {
                // console.log("d.y " + d.y);
                // return d.y;
                return d.y = Math.max(10, Math.min(height - 10, d.y));
            });
        junk
            .attr("x", function (d) {
                // return d.x + 5;
                return d.x = Math.max(5, Math.min(width - 75, d.x + 5));
            })
            .attr("y", function (d) {
                // return d.y;
                return d.y = Math.max(1, Math.min(height - 10, d.y));
            });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

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