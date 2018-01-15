var margin = { top: 0, right: 100, bottom: 100, left: 100 };

var width = 900 - margin.left - margin.right;

var height = 2000 - margin.top - margin.bottom;

var cubeSize = 50;
     
var colors = ["#fff7bc","#ffeda0","#fec44f","#feb24c","#fc9272","#e6550d","#d95f0e","#f03b20","#de2d26"], 
    character = ["Baratheon", "Greyjoy", "Lannister", "Martell", "Stark", "Targaryen", "Tyrell"];
    episode = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var svg = d3.select("#chart").append("svg") 
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")   
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          
d3.csv("heatmap.csv",function(error, data) {

      var select = d3.select('#sellectbox')
                      .append('select')
                      .attr('class','select')
                      .on('change',changenow);

      var options = select.selectAll('option')
                   .data(new Array(6)).enter()
                   .append('option')
                   .text(function (d,i) { return i+1; });

     changenow();

     function changenow(){
      selectValue = d3.select('select').property('value');

       var max = 35;

       var magic = [];
       var appear =[];

       var colorScale = d3.scale.quantile()       
                          .domain([0, 8, max])  
                          .range(colors);

       for (var i = 0; i < 10; i++){
                    magic[i*7] = +data[10*(selectValue-1)+i].Baratheon;
                    magic[i*7+1] = +data[10*(selectValue-1)+i].Greyjoy;
                    magic[i*7+2] = +data[10*(selectValue-1)+i].Lannister;
                    magic[i*7+3] = +data[10*(selectValue-1)+i].Martell;
                    magic[i*7+4] = +data[10*(selectValue-1)+i].Stark;
                    magic[i*7+5] = +data[10*(selectValue-1)+i].Targaryen;
                    magic[i*7+6] = +data[10*(selectValue-1)+i].Tyrell;
        }


       for(var j=0;j<7;j++){
                  appear[j*10] = magic[j];
                  for(var k=1;k<10;k++){
                      appear[j*10+k] = magic[(k+1)*7+j];
                  }
                  appear[j*10+9] = magic[1*7+j];
        }

       svg.selectAll(".episode")
          .data(appear)
          .enter()       
          .append("rect")
          .attr("class", "border")
          .attr("width", cubeSize)
          .attr("height", cubeSize)
          .attr("x", function(d, i){ return 100+(i%10)*cubeSize;})
          .attr("y", function(d, i){ return 50+parseInt(i / 10)*cubeSize;})
          .transition()
          .duration(0)
          .style("fill", function(d) { return colorScale(d); });

            svg.selectAll(".yLabel")
                  .data(character)
                  .enter()    
                  .append("text") 
                  .attr("x", 100)
                  .attr("y", function (d, i) { return 50+i * 50; })
                  .text(function(d) { return d; })
                  .style("text-anchor", "end")
                  .attr("transform", "translate(-6," + cubeSize / 1.5 + ")")
                    

            svg.append("g")
              .append("text")
              .attr("x", 100)
              .attr("y", 0)
              .style('font-weight', 'bold')
              .style('fill', 'black')
              .text("House")
              .style("text-anchor", "end")
              .style("font-size","15px")
              .attr("transform", "translate(-6," + cubeSize / 1.5 + ")");
            
            svg.selectAll(".xLabel")
                  .data(episode)
                  .enter().append("text")
                  .attr("x", function(d, i) { return 100+i * cubeSize; })
                  .attr("y", 50+cubeSize*7.5)
                  .text(function(d) { return d; })
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(25, -6)");
                    

            svg.append("g")
              .append("text")
              .attr("x", 11*cubeSize+100)
              .attr("y", 50+cubeSize*7.5)
              .style('fill', 'black')
              .style('font-weight', 'bold')
              .style("font-size","15px")
              .text("Episode")
              .style("text-anchor", "end")
              .attr("transform", "translate(25, -6)");

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend")
              .append("text")
              .attr("x", 280)
              .attr("y", 440)
              .text("No of Appearances")
              .style("font-size","18px");

          legend.append("rect")
            .attr("width", 50)  
            .attr("height", 25)
            .attr("x", function(d, i) {
              return 120+cubeSize * i;
            })
            .attr("y", 450)
            .attr("stroke","black")
            .style("fill", function(d, i) {
              return colors[i]; 
            });

          legend.append("text")
            .attr("class", "size")
            .text(function(d) { 
              return Math.round(d); 
            })
            .attr("x", function(d, i) { 
              return 120+cubeSize * i; 
            })
            .attr("y", 490);

          legend.exit().remove();
    };
});