(function() {
    'use strict';

    var margin = {
        top: 10,
        right: 0,
        bottom: 175,
        left: 75
      };
      var contentWidth = $('#d3-heat-map')[0].clientWidth;
      var width = contentWidth - margin.left - margin.right,
      height = contentWidth - margin.top - margin.bottom,
      msgBox = {
        'width': 125,
        'height': 50
      };
    var baseTemperature;
  
    var yLabel = 'Months';
    var xLabel = 'Years';
  
    var key = [35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35];
    var values = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];
  
    var head1 = 'Monthly Global Land-Surface Temperature';
    var head2 = '1753 - 2015';
    var head3 = 'Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951 - Dec 1980 absolute temperature ℃: 8.66 +/- 0.07';
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var x = d3.scaleTime()
      .range([0, width]);
  
    var xGrid = d3.scaleBand()
      .padding(0)
      .range([0, width]);
  
    var y = d3.scaleTime();
  
    var xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%Y"))
      .ticks(25, 10)
      .scale(x);
  
    var yAxis = d3.axisLeft().tickFormat(d3.timeFormat('%B'))
      .scale(y);
  
    d3.select('#d3-heat-map').append('div').attr('class', 'heading');
    d3.select('.heading').style('padding-left', margin.left + 'px');
    d3.select('.heading').append('h1').attr('class', 'title1').text(head1);
    d3.select('.heading').append('h4').attr('class', 'title2').text(head2);
    d3.select('.heading').append('h5').attr('class', 'title3').text(head3);
  
    var svg = d3.select('#d3-heat-map').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var div = d3.select('#d3-heat-map').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('width', msgBox.width + 'px')
      .style('height', msgBox.height + 'px');
  
    var temps = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    d3.json(temps, function(data) {
      baseTemperature = data.baseTemperature;
  
      var monthlyVariance = data.monthlyVariance;
  
      var years = monthlyVariance.map(function(d) {
        return d.year;
      });
      years = years.filter(onlyUnique);
      var cellHeight = height / 12;
      var cellWidth = xGrid.bandwidth() / years.length;
      var cell = {
        'height': cellHeight,
        'width': cellWidth
      };
  
      xGrid.domain(years);
      x.domain([new Date(1753, 0), new Date(2015, 6)]);
      y.domain([new Date(2016, 11), new Date(2016, 0)]);
      y.range([height - (cell.height / 2), cell.height / 2])
  
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
  
      svg.append('g')
        .attr('class', 'y text')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr("text-anchor", "middle")
        .attr('x', (height / 2) * -1)
        .attr('y', (margin.left - 20) * -1)
        .text(yLabel);
  
      svg.append('g')
        .attr('class', 'x text')
        .append('text')
        .attr("text-anchor", "middle")
        .attr('y', height + (margin.bottom / 4))
        .attr('x', (width / 2))
        // .attr('x', 400)
        .text(xLabel);
  
      svg.selectAll('rect')
        .data(key)
        .enter().append('rect')
        .attr('class', function(d, i) {
          return 'color' + i
        })
        .attr('width', function(d) {
          return d;
        })
        .attr('height', function(d) {
          return d;
        })
        .attr('x', function(d, i) {
          return d *= i;
        })
        .attr('y', height + (margin.bottom / 2));
  
      svg.selectAll('d').data(values).enter().append('text')
        .attr('class', 'key-text')
        .attr('x', function(d, i) {
          return i * 35;
        })
        .attr('y', height + (margin.bottom / 2) + 33)
        .text(function(d) {
          return d;
        });
  
      svg.selectAll('cell')
        .data(monthlyVariance)
        .enter().append('rect')
        .attr('class', function(d) {
          return setColor(d);
        })
        .attr('width', cell.width)
        .attr('height', cell.height)
        .attr('x', function(d) {
          return xGrid(d.year);
        })
        .attr('y', function(d, c) {
          return (d.month * cell.height) - cell.height;
        })
        .on("mouseover", function(d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(setMsgBox(d))
            .style("left", (d3.event.pageX - (msgBox.width / 2)) + "px")
            .style("top", (d3.event.pageY - (cell.height + msgBox.height)) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  
    function setMsgBox(d) {
      var year = d.year,
        temperature = baseTemperature,
        variance = d.variance,
        text = '',
        total = baseTemperature;
  
      total += variance;
      text = monthNames[d.month - 1] + ' ' + d.year + '<br/>';
      text += total.toFixed(3) + ' &deg;C' + '<br/>';
      text += variance.toFixed(3) + ' &deg;C' + '<br/>';
      return text;
    }
  
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
  
    function setColor(d) {
      // console.log(d);
      var total = baseTemperature,
        name = '';
      total += d.variance;
  
      if (total >= '12.7') {
        name = 'color10';
      }
      if (total < '12.7') {
        name = 'color9';
      }
      if (total < '11.6') {
        name = 'color8';
      }
      if (total < '10.5') {
        name = 'color7';
      }
      if (total < '9.4') {
        name = 'color6';
      }
      if (total < '8.3') {
        name = 'color5';
      }
      if (total < '7.2') {
        name = 'color4';
      }
      if (total < '6.1') {
        name = 'color3';
      }
      if (total < '5') {
        name = 'color2';
      }
      if (total < '3.9') {
        name = 'color1';
      }
      if (total < '2.7') {
        name = 'color0';
      }
  
      return name + " cell";
    }
  })();