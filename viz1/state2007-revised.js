
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1500 - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var svg = d3.select("#canvas-svg").append("svg").attr({
    width: WIDTH + 20,
    height: HEIGHT
});

var y0 = d3.scale.linear(), 
    y1 = d3.scale.linear(), 
    yAxisLeft = d3.svg.axis().orient("top").tickSize(-HEIGHT, 0, 0).scale(y0), 
    yAxisRight = d3.svg.axis().orient("top").tickSize(-HEIGHT, 0, 0).scale(y1), 
    //yAxisGLeft = svg.append("g").attr("class", "axis").attr("transform", "translate(" + (LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2) + "," + (MARGIN_TOP - 1) + ")"), 
    //yAxisG = svg.append("g").attr("class", "axis").attr("transform", "translate(" + (LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2) + "," + (MARGIN_TOP - 1) + ")");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y0 = d3.scale.linear()
    .range([height, 0]),
    y1 = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxisLeft = d3.svg.axis()
    .scale(y0)
    .orient("left")
    .ticks(20);

var yAxisRight = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .tickFormat(formatPercent);

var tip1 = d3.tip()
  .attr('class', 'd3-tip1')
  .offset([-10, 0])
  .html(function(d) {
    return "Number of Poverty: <span style='color:orange'>" + d.number + "</span>";
  })

var tip2 = d3.tip()
  .attr('class', 'd3-tip2')
  .offset([-10, 0])
  .html(function(d) {
    return "Percentage: <span style='color:gold'>" + d.percentage + "</span>";
  })

var svg = d3.select("#container1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip1);
svg.call(tip2);

d3.tsv("data/byStates2007withPercentage.tsv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.states; }));
  y0.domain([0, d3.max(data, function(d) { return d.number; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  
  svg.append("g")
      .attr("class", "y axis axisLeft")
      .attr("transform", "translate(0,0)")
      .call(yAxisLeft)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .text("Number of Poverty");

  svg.append("g")
      .attr("class", "y axis axisRight")
      .attr("transform", "translate(" + (width) + ",0)")
      .call(yAxisRight)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .text("Percentage");

  bars = svg.selectAll(".bar").data(data).enter();
  bars.append("rect")
      .attr("class", "bar1")
      .attr("x", function(d) { return x(d.states); })
      .attr("width", x.rangeBand()/2)
      .attr("y", function(d) { return y0(d.number); })
      .attr("height", function(d,i,j) { return height - y0(d.number); })
      .on('mouseover', tip1.show)
      .on('mouseout', tip1.hide);

  bars.append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.states) + x.rangeBand()/2; })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function(d) { return y1(d.percentage); })
      .attr("height", function(d,i,j) { return height - y1(d.percentage); })
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

});



function type(d) {
  d.number = +d.number;
  return d;
}
