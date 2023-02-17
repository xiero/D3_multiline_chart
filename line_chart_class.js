class LineChart {
    constructor(parentelement, data) {
        this.parentelement = parentelement;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.margin = { top: 10, right: 30, bottom: 30, left: 60 }
        vis.width = 460 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#chart-area1")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.right)
            //.call(d3.zoom().on("zoom", zoomed))
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`)

        vis.x = d3.scaleLinear().range([0, vis.width]);
        vis.y = d3.scaleLinear().range([vis.height, 0]);

        vis.sumstat = d3.groups(this.data, d => d.name);

        // add x axis --> it is  a date format
        vis.x.domain(d3.extent(this.data, d => d.year))


        vis.svg.append("g")
            .attr('transform', `translate( 0, ${vis.height})`)
            .call(d3.axisBottom(vis.x).ticks(5));

        //add y axis
        vis.y.domain([0, d3.max(this.data, d => Number(d.n))])

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        this.update(this.data);

        // d3.interval(() => {
        //     update();
        // }, 100);

        // d3.selectAll(".checkbox").on("change", update)


    }

    update(data) {
        const vis = this;
        vis.data = data;
        console.log(vis.data);
        vis.sumstat = d3.groups(vis.data, d => d.name);

        vis.dataFilter = vis.sumstat.filter(this.filtercallBack);

        // console.log(dataFilter);
        // color palette
        vis.color = d3.scaleOrdinal()
            .domain(["Helen", "Betty", "Dorothy", "Linda", "Deborah", "Jessica", "Patricia", "Ashley"])
            .range(['#e41a1c', '#305eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', "#9fdfdf"])

        //JOIN new data with old elements
        vis.lines = vis.svg.selectAll(".line")
            .data(vis.sumstat)

        //EXIT old elements not present in new data
        vis.lines.exit().remove();

        //ENTER new elements present in new data
        vis.lines.join("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", function (d) { return vis.color(d[0]) })
            .attr("stroke-width", 1)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return vis.x(d.year); })
                    .y(function (d) { return vis.y(LineChart.getRandomInt(0, 90000)) })
                    (d[1])
            })
    }

    filtercallBack(d) {
        let checkboxes = document.querySelectorAll(".checkbox");
         
         for (const checkbox of checkboxes) {
             if( d[0] === checkbox.name && checkbox.checked === true  ) {
                return true;
             } 
         }
      }



    static getRandomInt(minVal, maxVal) {
        const min = Math.ceil(minVal);
        const max = Math.floor(maxVal);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
      }
}