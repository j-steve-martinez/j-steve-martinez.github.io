(function () {
    /**
     * National Contiguity with a Force Directed Graph
     */
    'use strict';
    // ["_groups"][0][0].clientWidth
    var contentWidth = $('#d3-contiguity')[0].clientWidth;
    var margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        width = contentWidth - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom,
        msgBox = {
            'width': 125,
            'height': 50
        },
        flag = {
            'width': 25,
            'height': 15
        };

    var heading = d3.select('#d3-contiguity')
        .append('h1')
        .attr('class', 'heading')
        .text('National Contiguity');

    var force = d3.select('#d3-contiguity')
        .append('div')
        .attr('class', 'force');

    var svg = d3.select('.force')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d, i) {
            return i;
        }))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(20));


    var flagLocation = '../images/flags/';
    var countries = '../examples/freeCodeCamp/countries.json';
    d3.json(countries, function (error, data) {
        if (error) throw error;

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", '2');

        var node = svg.append('g')
            .attr("class", "nodes")
            .selectAll('image')
            .data(data.nodes)
            .enter().append('image')
            .attr('xlink:href', function (d) {
                return flagLocation + d.code + '.png'
            })
            .attr('width', +flag.width).attr('height', flag.height)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append('title').text(function (d) {
            return d.country
        });

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(data.links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x + (flag.width / 2);
                })
                .attr("y1", function (d) {
                    return d.source.y + (flag.height / 2);
                })
                .attr("x2", function (d) {
                    return d.target.x + (flag.width / 2);
                })
                .attr("y2", function (d) {
                    return d.target.y + (flag.height / 2);
                });

            node
                .attr("x", function (d) {
                    return d.x = Math.max(1, Math.min(width - flag.width, d.x));
                })
                .attr("y", function (d) {
                    return d.y = Math.max(flag.height, Math.min(height - flag.height, d.y));
                });
        }

    });
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
        d.fx = d.x;
        d.fy = d.y;
    }
})();