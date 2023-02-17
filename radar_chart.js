(() => {
    const data = [];
    const features = ["345", "330", "315", "300", "285", "270", "255", "240", "225", "210", "195", "180", "165", "150", "135", "120", "105", "90", "75", "60", "45", "30", "15", "0"];



    for (var i = 0; i < 3; i++) {
        var point = {}
        //each feature will be a random number from 1-9
        features.forEach(f => point[f] = 1 + Math.random() * 8);
        data.push(point);
    }
    // console.log(data);
    /****************************************************************************** */
    const width = 460;
    const height = 460;

    const svg = d3.select("#chart-area2").append("svg")
        .attr("width", width)
        .attr("height", height);

    /**********************plotting the gridlines *****************************/
    const radialScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 200]);
    const ticks = [2, 4, 6, 8, 10];

    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", d => radialScale(d))

        );

    /**********************add text labels*********************************** */
    // svg.selectAll("thicklabel")
    //     .data(ticks)
    //     .join(
    //         enter => enter.append("text")
    //             .attr("class", "ticklabel")
    //             .attr("x", width / 2 + 5)
    //             .attr("y", d => height / 2 - radialScale(d))
    //             .text( d => d.toString())
    //     );

    /******************plotting the axis************************************ */
    function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return { x: width / 2 + x, y: height / 2 - y }
    }

    const featureData = features.map((f, i) => {
        let value = 10.5;
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length + 0.25);

        if (angle >= 2.34 && angle <= 4.44) {
            value = value + 0.7;
        }

        return {
            name: f,
            angle: angle,
            line_coord: angleToCoordinate(angle, 10),
            label_coord: angleToCoordinate(angle, value)
        };
    })

    //draw axis line
    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke", "black")
        );

    //draw axis label
    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x)
                .attr("y", d => d.label_coord.y)
                .text(d => d.name)

        );

    // plotting the data

    // let line = d3.line()
    //     .x( d => d.x)
    //     .y( d => d.y);

    // let colors = ["darkorange", "gray", "navy"];

    // function getPathCoordinates(dataPoint){
    //     let coordinates = [];
    //     for( let i = 0; i < features.length; i++) {
    //         let ft_name = features[i];
    //         let angle = (Math.PI / 2) + ( 2 * Math.PI * i / features.length);
    //         coordinates.push(angleToCoordinate(angle, dataPoint[ft_name]))
    //     }

    //     console.log(coordinates);
    //     return coordinates;
    // }

    function getPointCoordinate(dataPoint) {
        let coordinates = [];
        for (let i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, dataPoint[ft_name]))
        }

        return coordinates;
    }




    // let pointData;
    // data.forEach(d => {
    //     pointData = getPointCoordinate(d);
    // })

    // console.log("point data",pointData);


    d3.interval(() => {
        updatePoints()
    }, 100)



    function updatePoints() {
        /*****generate data *********************************************************/
        const data = [];
        const features = ["345", "330", "315", "300", "285", "270", "255", "240", "225", "210", "195", "180", "165", "150", "135", "120", "105", "90", "75", "60", "45", "30", "15", "0"];


        for (var i = 0; i < 3; i++) {
            var point = {}
            //each feature will be a random number from 1-9
            features.forEach(f => point[f] = 1 + Math.random() * 8);
            data.push(point);
        }

        let pointData;
        data.forEach(d => {
            pointData = getPointCoordinate(d);
        })


        const color = d3.scaleOrdinal()
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
        /**************************************************************************** */
        //JOIN new data with old elements
        const points = svg.selectAll(".point")
            .data(pointData);

        //EXIT old elements not present in new data
        points.exit().remove();

        //ENTER new elements present in new data
        points.join("circle")
            .attr("class", "point")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 15)
            .attr("opacity", 0.5)
            .style("fill", d => color(d));
    }


})()

