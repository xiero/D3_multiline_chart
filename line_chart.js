const margin = {top: 10, right: 30, bottom: 30, left: 60}
const width = 460 - margin.left - margin.right;
const height = 400 -  margin.top - margin.bottom;

//append the svg object to the chart area
const svg = d3.select("#chart-area1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.right)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);




//read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
    .then( data => {

      // group the data i want to draw one line per group
      sumstat = d3.groups(data, d => d.name);

      console.log(sumstat);

      // add x axis --> it is  a date format
       x.domain( d3.extent(data, d => d.year))
       

      svg.append("g")
        .attr('transform', `translate( 0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

      //add y axis
      y.domain([0, d3.max(data, d => Number(d.n))])
        
      svg.append("g")
        .call(d3.axisLeft(y));

      // // color palette
      // const color = d3.scaleOrdinal()
      //   .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

      // //draw the lines
      // svg.selectAll(".line")
      // .data(sumstat)
      // .join("path")
      //   .attr("fill", "none")
      //   .attr("stroke", function(d){ return color(d[0]) })
      //   .attr("stroke-width", 1.5)
      //   .attr("d", function(d){
      //     return d3.line()
      //       .x(function(d) { return x(d.year); })
      //       .y(function(d) { return y(+d.n); })
      //       (d[1])
      //   })

        d3.interval(()=>{
          update();
        },10000);

        update();

    }).catch( err => console.log(err));

function update() {
  console.log("hello");
  // color palette
  const color = d3.scaleOrdinal()
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // svg.selectAll(".line")
    // .data(sumstat)
    // .join("path")
    //   .attr("fill", "none")
    //   .attr("stroke", function(d){ return color(d[0]) })
    //   .attr("stroke-width", 1.5)
    //   .attr("d", function(d){
    //     return d3.line()
    //       .x(function(d) { return x(d.year); })
    //       .y(function(d) { return y(+d.n); })
    //       (d[1])
    //   })


      //JOIN new data with old elements
      const lines =  svg.selectAll(".line")
      .data(sumstat)

      //EXIT old elements not present in new data
      lines.exit().remove();
      //UPDATE old elements present in new data
      lines
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d[1])
        })

      //ENTER new elements present in new data
      lines.enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.n); })
            (d[1])
        })
}