    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    // Select k number random centroids
    function randomCent(data, k) {
        var array = [];
        var random;

        for(var i = 0; i < k; ++i) {
            random = Math.floor(Math.random() * data.length) + 1;

            var newCluster = [];
            newCluster.push( parseData( data[random]) );
            array.push(newCluster);
        }
        return array;
    }

    // Parses a data object (string) to float
    function parseData(d) {
        var obj = [];

        for(var i = 0; i < DIM.length; ++i) {
            obj.push( parseFloat ( d[DIM[i]] ) );
        }

        return obj;
    }

    // calculate the euclidean distance
    function euclDist(c, p) {
        var sum = 0;

        for(var i = 0; i < c.length; ++i) {
            sum += Math.pow(c[i] - p[i], 2);
        }
        return Math.sqrt(sum);
    };

    // removes all elements in the clusters except the centroids.
    function clearClusters(clusterArray) {
        var newArray = [];

        for(var i = 0; i < clusterArray.length; ++i) {
            var cluster = [];
            cluster.push(clusterArray[i][0]);
            newArray.push(cluster);
        }

        clusterArray = newArray;
        return clusterArray;
    }

    // Select points by k clusters
    function sortCluser(data, clusterArray) {

        var min, dist, index;
        var point;
        colorindex = [];

        // if the array is full of points, remove all points.
        if(clusterArray[0].length > 1) {
            clusterArray = clearClusters(clusterArray);
        }

        // distribute the points to the nearest clusters
        for(var i = 0; i < data.length; ++i) {
            min = Number.MAX_VALUE;
            point = parseData(data[i]);

            for(var c = 0; c < clusterArray.length; ++c) {

                dist = euclDist(point , clusterArray[c][0] );

                if(dist < min) {
                    min = dist;
                    index = c;
                }
            }
            clusterArray[index].push(point);
            colorindex.push(index);
        }
        return clusterArray;
    };

    // find the new centroids.
    function recalcClusters(clusterArray) {
        var center =  [];
        for(var i = 0; i < clusterArray.length; ++i) {
            center = calcClusterCenter(clusterArray[i]);
            clusterArray[i][0] = center;
        }
        
        return clusterArray;
    }

    // find the new centroid with "Center of mass".
    function calcClusterCenter(cluster) {
        var center = [];
        center.length = DIM.length;
        center.fill(0);

        for(var i = 1; i < cluster.length; ++i) {
            for(var d = 0; d < DIM.length; ++d) {
                center[d] += cluster[i][d];
            }
        }   

        for(var d = 0; d < DIM.length; ++d) {
            center[d] /= (cluster.length-1);
        }
        return center;
    }

    // The square error value for all points.
    function sumSquaredError(clusterArray) {
        var error = 0.0;

        for(var c = 0; c < clusterArray.length; ++c) {
            for(var p = 1; p < clusterArray[c].length; ++p) {
                error += Math.pow(euclDist( clusterArray[c][0], clusterArray[c][p] ) , 2);
            }
        }
        return error;
    }
   
   // The "main" function.
    function kmeans(data, k) {

        DIM = Object.keys(data[0]);
        var error = Number.MAX_VALUE, prevError;
        var threshold = 0.3;
        tot = 0;
        // for k items
        var clusters = randomCent(data, k);

        do{
           // 2. Distributes points into clusers
           clusters = sortCluser(data, clusters);
           // 3.
           clusters = recalcClusters(clusters);
           // 4.
           prevError = error;
           error = sumSquaredError(clusters);
           ++tot;
        }while(error != prevError);

    console.log("Final sum of square error value: " + error);
    console.log("Total iterations: " + tot);

    //console.log(colorindex);

    return colorindex;

    };