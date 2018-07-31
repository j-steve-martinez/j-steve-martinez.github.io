(() => {
    var margin = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 40
    };

    // Get parent element width
    var contentWidth = $("#content")[0].clientWidth;

    var width = contentWidth - margin.left - margin.right;
    var height = (contentWidth / 2) - margin.top - margin.bottom;

    d3.select('#content').attr('width', width);
    // Parse the date / time
    var parseDate = d3.timeFormat("%Y-%B");

    var x = d3.scaleBand().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks(10);
    var yAxis = d3.axisLeft(y).ticks(10);

    var heading = d3.select('#content').append('div')
        .append('h1').attr('id', 'title');

    var chart = d3.select('#content').append('div').attr('class', 'chart');
    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var footer = d3.select('#content').append('div').attr('id', 'footer').attr('width', width).attr('min-width', width);
    var div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

    d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function (error, gdp) {
        // console.log(gdp);
        var description = gdp.description;
        var title = gdp.name.split(',')[0];
        heading.text(title);
        footer.text(description);
        // console.log(title);
        var data = [],
            obj = {},
            date, value;
        gdp.data.forEach(function (item) {
            date = item[0].split('-');
            date = new Date(date[0], (date[1] - 1), date[2]);
            obj = {
                'date': date,
                'value': item[1]
            };
            data.push(obj);
        });
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });
        // console.log(data);
        var dateRange = [];
        dateRange.push(data[0].date.slice(0, 4));
        dateRange.push(data[data.length - 1].date.slice(0, 4));
        // console.log(dateRange);

        var xAxisScale = d3.scaleLinear().range([0, width]).domain(dateRange);
        var xAxis = d3.axisBottom(xAxisScale).ticks(10).tickFormat(d3.format('d'));

        x.domain(data.map(function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + (height) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "1.5em")
            .attr("dy", ".8em");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value ($)")

        svg.append('g')
            .attr('class', 'y text')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -200)
            .attr('y', 18)
            .text(title);

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr('class', 'bar')
            .attr("x", function (d) {
                return x(d.date);
            })
            .attr("width", 5)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html('<b>' + d3.format('$')(d.value) + ' BILLIONS</b>' + "<br/>" + d.date)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });

})();