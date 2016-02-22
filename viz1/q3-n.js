
          $("#slider").slider({
          value:2002,
          min: 2002,
          max: 2013,
          step: 1,

          slide: function( event, ui ) {
            $("#year").val(ui.value);
            redraw(ui.value.toString());
          }
          });

          $("#year").val($("#slider").slider("value") );


        var
        color_q0 = 'rgb(198,219,239)',
        color_q1 = 'rgb(158,202,225)',
        color_q2 = 'rgb(107,174,214)',
        color_q3 = 'rgb(66,146,198)',
        color_q4 = 'rgb(33,113,181)',
        color_q5 = 'rgb(8,81,156)',
        color_q6 = 'rgb(8,48,107)',
        colorScale = [
          color_q0,
          color_q1,
          color_q2,
          color_q3,
          color_q4,
          color_q5,
          color_q6
        ] // ar
        var quantize = d3.scale.quantize()
        .domain([50, 6500])
        .range(d3.range(7).map(function(i) { return "q" + i; }));
        var jsonStatePer = {};
        

      

      var map = new Datamap({
        scope: 'usa',
        element: document.getElementById('container1'),
        projection: 'mercator',
        height: 500,
        fills: {
            defaultFill: 'rgb(222,235,247)',
            // define colors for quantized scale
            q0: color_q0,
            q1: color_q1,
            q2: color_q2,
            q3: color_q3,
            q4: color_q4,
            q5: color_q5,
            q6: color_q6
          },

          data: jsonStatePer,
          geographyConfig: {
            popupTemplate: function(geo, data) {
               if (data == null)
                return '<div class="hoverinfo"><strong>No data available for ' + geo.properties.name + '</strong></div>';
              return ['<div class="hoverinfo"><strong>',
              geo.properties.name,
              ' has ' + data.Percent + ' poor people ',
              '</strong></div>'].join('');
            },
            highlightBorderWidth: 5
          },
          responsive: true
         });

    
         d3.tsv("data/2013n.tsv", function (error, data) {
          data.forEach(function(d) {
            // create data for map
            jsonStatePer[ d.States ] = {
              fillKey: quantize(d["2002"]),
              Percent: d["2002"],
            };
            map.updateChoropleth(jsonStatePer);
          });
        }); 

         

        function redraw(year) {
          var svg = d3.select("svg");
           svg1.selectAll("*").remove();

          d3.tsv("data/2013n.tsv", function (error, data) {
          data.forEach(function(d) {
            // create data for map
            jsonStatePer[ d.States ] = {
              fillKey: quantize(d[year]),
              Percent: d[year],
            };
            map.updateChoropleth(jsonStatePer);
          });
        
              
            // Parse numbers, and sort by value.
            data.forEach(function(d) { d[year] = +d[year] ; });
            data.sort(function(a, b) { return b[year] - a[year]; });

            // Set the scale domain.
            x.domain([0, d3.max(data, function(d) { return d[year]; })]);
            y.domain(data.map(function(d) { return d.States; }));

            var bar = svg1.selectAll("g.bar")
                .data(data)
              .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d) { return "translate(0," + y(d.States) + ")"; });

            bar.append("rect")
                .attr("width", function(d) { return x(d[year]); })
                .attr("height", y.rangeBand());


            bar.append("text")
                .attr("class", "value")
                .attr("x", function(d) { return x(d[year]); })
                .attr("y", y.rangeBand() / 2)
                .attr("dx", -3)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function(d) { 
                  return format(d[year]); });

            svg1.append("g")
                .attr("class", "x axis")
                .call(xAxis);

            svg1.append("g")
                .attr("class", "y axis")
                .call(yAxis);
          });

             
        }
        map.labels();

    // append the container for the legend
        d3.select('svg')
          .append('g')
          .attr('class', 'legend');
        
        

        var
          legendBarWidth = 30,
          legendBarHeight = 10,
          legendOffsetX = 30,
          legendOffsetY = 400;

        // draw the legend
        d3.select('.legend').selectAll('.legend')
        .data(colorScale)
        .enter()
          .append('rect')
            .attr('x', legendOffsetX)
            .attr('y', function(d,i) {
              return legendOffsetY + legendBarHeight*i;
            })
            .attr('width', legendBarWidth)
            .attr('height', legendBarHeight)
            .attr('fill', function(d){ return d; });

        // draw the legend text labels
        d3.select('.legend').selectAll('.legend')
        .data(colorScale)
        .enter()
          .append('text')
            .text(function(d,i){
              var quantizedRange = quantize.invertExtent('q'+i);
              return quantizedRange[0].toFixed(1) + ' - ' +
              quantizedRange[1].toFixed(1);
            })
            .attr('x', legendOffsetX+(legendBarWidth*1.25))
            .attr('y', function(d,i){
              return legendOffsetY + (legendBarHeight*0.9) + legendBarHeight*i;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black");
    
    /// Bar Chart
          var m = [20, 7, 7, 750],
              w = 1100 - m[1] - m[3],
              h = 600 - m[0] - m[2];

          var format = d3.format(",.0f");

          var x = d3.scale.linear().range([0, w]),
              y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

          var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
              yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

          var svg1 = d3.select("#container1").append("svg")
              .attr("width", w + m[1] + m[3])
              .attr("height", h + m[0] + m[2])
              .append("g")
              .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


          d3.tsv("data/2013n.tsv", function(data) {

            // Parse numbers, and sort by value.
            data.forEach(function(d) { d["2002"] = +d["2002"]; });
            data.sort(function(a, b) { return b["2002"] - a["2002"]; });

            // Set the scale domain.
            x.domain([0, d3.max(data, function(d) { return d["2002"]; })]);
            y.domain(data.map(function(d) { return d.States; }));

            var bar = svg1.selectAll("g.bar")
                .data(data)
              .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d) { return "translate(0," + y(d.States) + ")"; });

            bar.append("rect")
                .attr("width", function(d) { return x(d["2002"]); })
                .attr("height", y.rangeBand());


            bar.append("text")
                .attr("class", "value")
                .attr("x", function(d) { return x(d["2002"]); })
                .attr("y", y.rangeBand() / 2)
                .attr("dx", -3)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function(d) { 
                  return format(d["2002"]); });

            svg1.append("g")
                .attr("class", "x axis")
                .call(xAxis);

            svg1.append("g")
                .attr("class", "y axis")
                .call(yAxis);
          });

