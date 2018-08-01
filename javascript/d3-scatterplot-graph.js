'use strict';
(function(){

  var margin = {top: 20, right: 10, bottom: 50, left: 20};
  var contentWidth = $("#d3-scatterplot-graph")[0].clientWidth;
  var width = contentWidth - margin.left - margin.right,
      height = contentWidth - margin.top - margin.bottom,
      msgBox = {'width' : 250, 'height' : 100};
  var yLabel = 'Ranking';
  var xLabel = 'Minutes Behind Fastest Time';

  var x = d3.scaleLinear()
          .range([0, width]);

  var y = d3.scaleLinear()
          .range([height, 0]);

  var xAxis = d3.axisBottom()
      .scale(x);

  var yAxis = d3.axisLeft()
      .scale(y);

  var title = d3.select("#d3-scatterplot-graph")
                .append('h2')
                .attr('class', 'title')
                .text('Doping in Professional Bicycle Racing');

  d3.select("#d3-scatterplot-graph").append('h4').attr('class', 'title').text('35 Fastest times up Alpe d\'Huez');
  d3.select("#d3-scatterplot-graph").append('h5').attr('class', 'title').text('Normalized to 13.8km distance');

  var div = d3.select("#d3-scatterplot-graph").append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0)
              .style('width', msgBox.width + 'px')
              .style('height', msgBox.height + 'px');
 
  var chart = d3.select("#d3-scatterplot-graph").append('div').attr('id', 'chart');


  var svg = d3.select('#chart').append('svg')
                .attr('width', width + margin.left +  margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data){
  // d3.json('./cyclist-data.json', function(err, data){
  // y scale is rank
  var rank = [];
  rank.push(data[data.length -1].Place + 2);
  rank.push(data[0].Place);

  // x scale is time for max to min
  var time = [], fastest, slowest, diff;
  slowest = data[data.length -1].Seconds;
  fastest = data[0].Seconds;
  diff = slowest - fastest;
  time.push(diff + 5);
  time.push(0);

  x.domain(time)
  y.domain(rank);

  // format in mm:ss
  xAxis.tickFormat(formatMinutes);
  xAxis.ticks(5);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .attr('dy', '10px')

  svg.append('g')
      .attr('class', 'y text')
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -66)
      .attr('y', 18)
      .text(yLabel);

  svg.append('g')
      .attr('class', 'x text')
    .append('text')
      .attr("text-anchor", "middle")
      .attr('y', height + margin.bottom)
      .attr('x', (width / 2))
      .text(xLabel);

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr('class', function(d) { return color(d.Doping); })
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.Seconds - fastest); })
      .attr("cy", function(d) { return y(d.Place); })
      .on("mouseover", function(d) {
          div.transition()
             .duration(200)
             .style("opacity", .9);
          div.html(showData(d))
             .style("left", setBox('left', d))
             .style("top",  setBox('top', d));
          })
      .on("mouseout", function(d) {
          div.transition()
             .duration(500)
             .style("opacity", 0);
      });

  svg.selectAll('a')
    .data(data)
    .enter().append('a')
      .attr('xlink:href', function(d){
        var url = d.URL;
        if (d.URL === '') {
          url = "https://en.wikipedia.org/wiki/List_of_doping_cases_in_cycling";
        }
          return url;
        })
      .attr('target', 'blank')
    .append('text')
      .attr('class', 'name')
      .text(function(d){ return d.Name;})
      .attr('x', (d) => {
        // console.log(d);
        // Float text left of dot if text rolls past width
        var totalLength = (x(d.Seconds - fastest) + 20) + d.Name.length;
        if (totalLength > width) {
          return x((d.Seconds - fastest) + (d.Name.length * 2) + 5);
        } else {
          return x(d.Seconds - fastest) + 10;
        }
      })
      .attr('y', function(d) { return y(d.Place) + 5; });

  });
  // function setName(d){
  //   console.log(d);
  //   console.log(d.Seconds);
  //   return x(d.Seconds - fastest) + 10;
  // }
  // put the msg box at the top left
  function setBox(side, data){
    // console.log(side);
    // console.log(data);
    var value, top, left;
    var size = checkScreenSize();
    
    var rect = document.getElementById("chart").getBoundingClientRect();
    // console.log(rect);
 
    left = rect.left + (margin.left * 2);
    top = rect.top + margin.top;
 
    if (side === 'top') {
      value = top + 'px';
    } else {
      value = left + 'px';
    }
    // console.log(value);
    return value;
  }

  // show the doping data
  function showData(d){
    var dope, html;
    // console.log(d);

    html = "<div>Name:" + d.Name + "</div>";
    html += "<div>Time:" + d.Time + "</div>";
    html += "<div>Rank:" + d.Place + "</div>";
    html += "<div>Year:" + d.Year + "</div>";
    html += "<div>Nationality:" + d.Nationality + "</div>";
    if (d.Doping === '') {
      dope = "None!"
    } else {
      dope = d.Doping
    }
    html += "<div>Doping:" + dope + "</div>";
   return html;
  }

  // set color based on doping
  function color(d){
    var color;
    if (d === "") {
      color = 'clean';
    } else {
      color = 'doping';
    }
    return color;
  }

  function formatMinutes(duration) {
    var duration = duration * 1000;
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? hours : hours;
    minutes = (minutes < 10) ? minutes : minutes;
    seconds = (seconds < 10) ? seconds : seconds;
    return minutes + ":" + seconds
    }

  function checkScreenSize(){
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {'width' : x, 'height' : y};
  }
})();
