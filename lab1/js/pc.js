function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];
    
    //initialize color scale
    var color = d3.scale.category20();
    
    //initialize tooltip
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};     

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

        self.data = data;

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {    
            return d != "Country" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
                .range([height, 0]));
        }));

        draw();
    });

    function draw(){

        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path 
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            .data(self.data)
            .enter().append("path")
            .attr("d", path)

            //Draw color
            .style("stroke", function(d,i) { return color(i); })

            .on("click", function(d){
                pc1.selectLine(d["Country"]);
            })

            .on("mousemove", function(d){
                tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

                tooltip.html(d["Country"])
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })

            .on("mouseout", function(d){
                tooltip.transition()
                .duration(200)
                .style("opacity", 0); 
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })

            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
		var selectedCountries = new Array();
		
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
			foreground.style("display", function(d) {
            foreground.style("opacity", 1)
            return actives.every(function(p, i) {		
				
				if(extents[i][0] <= d[p] && d[p] <= extents[i][1])
				{
					selectedCountries.push(d["Country"]);
					return true;
				}
				else{
					return false;
				}
            }) ? null : "none";
        });
		sp1.selectDot(selectedCountries);
        map.selectCountry(selectedCountries);
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){
		
		d3.select(".foreground")
		.selectAll("path")
		.style("opacity", function(d) {
            if(d["Country"] == value)
            {
                /* we cannot just send "value" directly into sp1,
                 because .js is too dumb for this shiet. An array of
                "strings" must be sent instead. */
                var selected = new Array();
                selected.push(value);
                sp1.selectDot(selected);
                map.selectCountry(selected);
                return 1;
            }
			else
				return 0;
        });
	};
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    };

}
