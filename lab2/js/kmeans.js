    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    clusters = {
  	'centroid'  : [],
  	'point': []
	};


    function qualityofcluster(dim) {
        var c, p; 
        var error = 0;

        for(var i = 0; i < clusters["centroid"].length; ++i) {
            c = clusters["centroid"][i];
            for(var j = 0; j < clusters["point"].length; ++j) {  
            //    console.log(c["index"]);
                p = clusters["point"][j];
              //  console.log(p["index"]);
                if(p["index"] == i) {

                    // Separat för varje k
                    // if-sats for att beräkna kvaliten
                    //console.log(clusters["centroid"][i]);
                    error += Math.pow(eucldist(c, p, dim), 2);
                }
            }
        }
        //console.log(error);
        return error;
    }

    function centerofcluster(dim) {

        var temp = [];
        temp.length = dim.length;
        var size;
        

        for(var i = 0; i < clusters["centroid"].length; ++i) {
            //temp.fill(0);
            temp = [0, 0, 0];
            //temp = [];
            size = 0;

            for(var j = 0; j < clusters["point"].length; ++j) {
                if(clusters["point"][j]["index"] == i) {
                    for(var k = 0; k < dim.length; ++k) {
                        //console.log(temp[0]);
                        temp[k] += parseFloat( clusters["point"][j][dim[k]] );
                        size++;
                        
                        //console.log(parseFloat( clusters["point"][j][dim[k]] ));
                    }

                }
            }
            console.log(temp);
            var c = clusters["centroid"][i];
            //console.log(c);
            //console.log(clusters["centroid"][i]);
            for(var k = 0; k < temp.length; ++k) {
                temp[k] /= size;
                //console.log(clusters["centroid"][i][dim[k]]);
                //console.log("Temp k(0): " + temp[0]);
                clusters["centroid"][i][dim[k]] = temp[k]; // Evil line
                //console.log(clusters["centroid"][i][dim[k]]);
                //console.log(clusters["centroid"][i]);    
                //c[dim[k]] = temp[k];
                //console.log("cluster: " + c);
                //console.log("temp[k]: " + temp[k]);      
            }    
        }
        //console.log(clusters["centroid"][0]['A'] + "");
    };

    // Select k number random centroids
    function randomcent(data, k) {
        var random;

        for(var i = 0; i < k; ++i) {
            random = Math.floor(Math.random() * data.length) + 1;
            clusters["centroid"].push(data[random]);
        }
    };

    // calculate the euclidean distance
    function eucldist(c, p, dim) {
    	var sum = 0;
 /*       console.log("DIM IS " + dim.length);
        console.log("C IS " + c);
        console.log("P IS " + p);
        console.log("DIM IS " + dim); */
    	for(var i = 0; i < dim.length; ++i) {
    		sum += Math.pow(c[dim[i]] - p[dim[i]], 2);
    	}
    	//console.log(sum);
        return Math.sqrt(sum);
    };

    // Select points by k clusters
    function sortcluser(dim, data) {

        var min, dist, index;

        clusters["point"] = [];

        for(var i = 0; i < data.length; ++i) {
            min = Number.MAX_VALUE, index = 0;
            for(var j = 0; j < clusters["centroid"].length; ++j) {
                //console.log(clusters["centroid"][j]);
                dist = eucldist(clusters["centroid"][j], data[i], dim);
                if(dist < min) {
                    min = dist;
                    index = j;
                }
            }
            clusters["point"].push(data[i]);
            clusters["point"][i]["index"] = index;
        }
    };

   
    function kmeans(data, k) {

        var err;
        var threshold = 0.5;
        var dim = Object.keys(data[0]);
        
        // 1
        randomcent(data, k);
        //console.log(clusters["centroid"]);

        do{
        // 2
            sortcluser(dim, data);

        // 3
            centerofcluster(dim);
            //console.log(clusters["centroid"]);
        // 4
            err = qualityofcluster(dim);
            //console.log(clusters["centroid"]);
            //console.log("Error = " + err);
            //console.log(clusters["point"].length);
        }while(err > threshold);
    };
    
    