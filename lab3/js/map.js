function map(data) {

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterdData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];
    //console.log(colors);
    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            //Complete the code
                data.push (
                {
                    type: "Feature", 
                    geometry: { 
                        type : "Point", 
                        coordinates: [(d.lon), (d.lat)]
                    },
                    properties: {
                        id: d.id,
                        time: d.time,
                        lat: d.lat,
                        lon: d.lon,
                        depth: d.depth,
                        mag: d.mag,
                        place: d.place,
                    } 
                }
            );
        });
        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point
        var point = g.selectAll("path").data(geoData.features);
        point.enter()
            .append("path")
            // Adds a classname tp all ponts in the graphics
            .attr("class", "point")
            .attr("d", path)
            .style("opacity", 1);
          
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
    
        var magnitude = value;

        g.selectAll(".point").each(function(p) {

            var point = d3.select(this);
            //console.log(point);
                //console.log(point.style("opacity"));
                point.style("opacity", function (d) {
                    if(d.properties.mag >= magnitude) {
                        return 1;
                    } else { return 0; }

            });
        });

    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {

        if(value[0].getTime() == value[1].getTime()) {
            g.selectAll(".point").each(function(p) {
            // Store each point (class) in a temp. variable
            var point = d3.select(this);
                point.style("opacity", 1);
            });
        } else {
            g.selectAll(".point").each(function(p) {
            // Store each point (class) in a temp. variable
            var point = d3.select(this);
                point.style("opacity", function (d) {
                    // Convert to date from string
                    var timeObj = new Date(d.properties.time);
                    // Within time range
                    if( (timeObj >= value[0]) && (timeObj < value[1]) ) {
                        return 1;
                    } else { return 0; }
                })
            });
        }
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        // Extract k-value from slider
        var k = document.getElementById("k").value;

        var pointArray = [];

        // Saves all points in a array
        g.selectAll(".point").each(function(p) {
            pointArray.push(p.geometry.coordinates);    
        });

        // Runs k-means
        // Returns index that corrospond with each cluster
        var colorindex = kmeans(pointArray, k);

        // Runs through all points
        g.selectAll(".point").each(function(p, i) {

            var ci = colorindex[i];
            var point = d3.select(this);

            point.style("fill", function (d) {
                return colors[ci];
            });
        });        
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
