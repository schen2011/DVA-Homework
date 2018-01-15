var width = 900,
    height = 600;

var sankey = d3.sankey()
         .nodeWidth(28)
         .nodePadding(12)
         .size([width,height]);

var svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + 300)
        .attr("height", height + 40);

d3.queue()
  .defer(d3.csv,"races.csv")
  .defer(d3.csv,"teams.csv")
  .await(linking);

function linking(error,races,teams){
  if (error) throw error;

  var cube = new Array();

  var line = new Array();

  var color = d3.scale.category20();

  teams.forEach(function (d) {
    cube.push({"name": d.team});
    line.push({"source": d.driver, "target": d.team, "value": d.points});
  });

  races.forEach(function (d) {
    cube.push({"name": d.race});
    cube.push({"name": d.driver});
    line.push({"source": d.race, "target": d.driver, "value": d.points});
  });

  cube = d3.keys(d3.nest().key(function(d) {
        return d.name;
      })
      .map(cube));

  for (i = 0; i < line.length; i++) {
    line[i].source = cube.indexOf(line[i].source);
    line[i].target = cube.indexOf(line[i].target);
  };

  cube.forEach(function(d,i) {
    cube[i] = {"name" : d};
  });

  sankey.nodes(cube)
      .links(line)
      .layout(20);

  var path = sankey.link();

  var div = d3.select("body").append("div")
    .attr("class", "linetip")
    .style("opacity", 0);

    var tip = d3.tip()
    .attr('class', "linetip")
    .offset(function() {
      return [0,0];
    })
    .html(function(d) {
      return d;
    });

  var link = svg.append("g").selectAll(".link")
        .data(line)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
            return Math.max(1, d.dy);
         })
        .on("mousemove", function(d) {
            div.transition()
                .duration(0)
                .style("opacity", .8);
            div .html(d.source.name + " → " +d.target.name + " "+d.value + " Points")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 20) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
                .duration(0)
                .style("opacity", 0);
          });

    var node = svg.append("g").selectAll(".node")
        .data(cube)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });

    node.append("text")
        .text(function(d) { 
            return d.name; 
        })
        .attr("text-anchor", "start")
        .attr("x", 30)
        .attr("y", function(d) { 
            return d.dy*0.8; 
         })
        .attr("font-size", "12px")

    node.append("rect")
        .text(function(d) { 
        return d.name; 
        })
        .attr("width", sankey.nodeWidth())
        .attr("height", function(d) { 
        return d.dy; 
        })
        .style("fill", function(d) { 
        return d.color = color(d.name); 
        });
}