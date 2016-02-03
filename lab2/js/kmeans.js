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

    // Select k number random centroids
    function randomcent(data, k) {
        var random;

        for(var i = 0; i < k; ++i) {
            random = Math.floor(Math.random() * data.length) + 1;
            clusters["centroid"].push(data[random]);
        }
    }

    // calculate the euclidean distance
    function eucldist(c, p, dim) {
    	var sum = 0;

    	for(var i = 0; i < dim.length; ++i) {
    		sum += Math.pow(c[dim[i]] - p[dim[i]], 2);
    	}
    	return Math.sqrt(sum);
    };

    // Select points by k clusters
    function sortcluser(dim, data) {

        var min, dist, index;

        for(var i = 0; i < data.length; ++i) {
            min = Number.MAX_VALUE, index = 0;
            for(var j = 0; j < clusters["centroid"].length; ++j) {
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

        var dim = Object.keys(data[0]);
        
        // 1
        randomcent(data, k);

        // 2
        sortCluser(dim, data);

        console.log(clusters);

    };
    
    