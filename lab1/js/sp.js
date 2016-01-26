function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var color = d3.scale.category20b();
    
    //initialize tooltip
    //...

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
        //...
        
        data.forEach(function(d) {
          d["Household income"] = +d["Household income"];
          d["Employment rate"] = +d["Employment rate"];
        });

        x.domain(d3.extent(data, function(d) { return d["Household income"]; })).nice();
        y.domain(d3.extent(data, function(d) { return d["Employment rate"]; })).nice();
        

        
        draw();

    });

    function draw()
    {
        
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
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d["Household income"]); })
            .attr("cy", function(d) { return y(d["Employment rate"]); })
            .style("fill", function(d,i) { return color(i); })

            //tooltip
            .on("mousemove", function(d) {
                //...    
            })
            .on("mouseout", function(d) {
                //...   
            })
            .on("click",  function(d) {
                //...
					//selectDot(self.data[0](1));
					//console.log(self.data[0]);
					//console.log(d);
					
					pc1.selectLine(d["Country"]);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        console.log(value);
		/*
		d3.select(".dot")
		.selectAll("dot")
		.style("opacity", function(d) {
			if(!value.empty() )
			{
				if(d["Country"] == value)
					return 1;
				else
					return 0;
			});
		*/
		
		
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




