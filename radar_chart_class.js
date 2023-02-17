class RadarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data
        this.features = ["345", "330", "315", "300", "285", "270", "255", "240", "225", "210", "195", "180", "165", "150", "135", "120", "105", "90", "75", "60", "45", "30", "15", "0"];
        this.initVis();
    }

    initVis() {
        const vis = this;
        vis.width = 460;
        vis.height = 460;

        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.radialScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, 200]);

        vis.ticks = [2, 4, 6, 8, 10];

        vis.svg.selectAll("circle")
            .data(vis.ticks)
            .join(
                enter => enter.append("circle")
                    .attr("cx", vis.width / 2)
                    .attr("cy", vis.height / 2)
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    .attr("r", d => vis.radialScale(d))

            );

        vis.featureData = vis.features.map((f, i) => {
            let value = 10.5;
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length + 0.25);

            if (angle >= 2.34 && angle <= 4.44) {
                value = value + 0.7;
            }

            return {
                name: f,
                angle: angle,
                line_coord: vis.angleToCoordinate(angle, 10),
                label_coord: vis.angleToCoordinate(angle, value)
            };
        });

        //draw axis line
        vis.svg.selectAll("line")
            .data(vis.featureData)
            .join(
                enter => enter.append("line")
                    .attr("x1", vis.width / 2)
                    .attr("y1", vis.height / 2)
                    .attr("x2", d => d.line_coord.x)
                    .attr("y2", d => d.line_coord.y)
                    .attr("stroke", "black")
            );

        //draw axis label
        vis.svg.selectAll(".axislabel")
            .data(vis.featureData)
            .join(
                enter => enter.append("text")
                    .attr("x", d => d.label_coord.x)
                    .attr("y", d => d.label_coord.y)
                    .text(d => d.name)

            );

        vis.update(this.data);

    }

    update(data) {
        console.log(data);
        let pointData = [];
        data.forEach(d => {
            pointData = this.getPointCoordinate(d);
        })

        this.color = d3.scaleOrdinal()
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
        /**************************************************************************** */
        //JOIN new data with old elements
        this.points = this.svg.selectAll(".point")
            .data(pointData);

        //EXIT old elements not present in new data
        this.points.exit().remove();

        //ENTER new elements present in new data
        this.points.join("circle")
            .attr("class", "point")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 15)
            .attr("opacity", 0.5)
            .style("fill", d => this.color(d));

    }


    angleToCoordinate(angle, value) {

        let x = Math.cos(angle) * this.radialScale(value);
        let y = Math.sin(angle) * this.radialScale(value);
        return { x: this.width / 2 + x, y: this.height / 2 - y }
    }

    getPointCoordinate(dataPoint) {
        let coordinates = [];
        for (let i = 0; i < this.features.length; i++) {
            let ft_name = this.features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
            coordinates.push(this.angleToCoordinate(angle, dataPoint[ft_name]))
        }

        return coordinates;
    }


}