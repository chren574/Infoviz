function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var color = d3.scale.category20();
    
    //initialize tooltip
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        data.forEach(function(d) {
          d["Household income"] = +d["Household income"];
          d["Employment rate"] = +d["Employment rate"];
        });

        x.domain(d3.extent(data, function(d) { return d["Household income"]; })).nice();
        y.domain(d3.extent(data, function(d) { return d["Employment rate"]; })).nice();
        
        draw(data);

    });

    function draw(data)
    {

        var cc = {};
        
        // crates an array with countries with an uniqe color
        data.forEach(function(d) {
            cc[d["Country"]] = color(d["Country"])
        });
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Household income (Cash)");
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Employment rate (%)");
            
        // Add the scatter dots. 
    		svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
            .attr("stroke-width", 0.5)
            .attr("stroke", "black")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d["Household income"]); })
            .attr("cy", function(d) { return y(d["Employment rate"]); })
            
            // Color the countries with data included
            //.style("fill", function(d,i) { return color(i); })
            .style("fill", function(d) { return cc[d["Country"]]; })

            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

                tooltip.html(d["Country"])
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                .duration(200)
                .style("opacity", 0); 
            })
            .on("click",  function(d) {
                
				//selectDot(self.data[0](1));
				pc1.selectLine(d["Country"]);
            });

    }

    //method for selecting the dot from other components
    this.selectDot = function(value){

        // "deselect" all dots
		svg.selectAll(".dot")
		.style("stroke-width", 0.5);

		// find the relevant dot in the scatterplot and compare with input
        svg.selectAll(".dot")
        .style("stroke-width", function(d){

        	var found = false;

        	value.forEach(function(e){
        		if(e == d["Country"])
        		{
        			found = true;
        		}
        	});

    	// transparency 2.0 vs 0.5 is returned if the country was selected or not
        	return found ? 2.0 : 0.5; 
        });
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




