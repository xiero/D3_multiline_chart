

const margin = {top: 10, right: 30, bottom: 30, left: 60}
const width = 460 - margin.left - margin.right;
const height = 400 -  margin.top - margin.bottom;

//append the svg object to the chart area
const svg = d3.select("#chart-area1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.right)
    //.call(d3.zoom().on("zoom", zoomed))
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);



//read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
    .then( data => {

      // group the data i want to draw one line per group
      sumstat = d3.groups(data, d => d.name);

      // add x axis --> it is  a date format
       x.domain( d3.extent(data, d => d.year))
       

      svg.append("g")
        .attr('transform', `translate( 0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

      //add y axis
      y.domain([0, d3.max(data, d => Number(d.n))])
        
      svg.append("g")
        .call(d3.axisLeft(y));

        update();

        d3.interval(()=>{
          update();
        },100);

        d3.selectAll(".checkbox").on("change", update )
    }).catch( err => console.log(err));

function update() {
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
  .then( data => {
    sumstat = d3.groups(data, d => d.name);

   const dataFilter = sumstat.filter(filtercallBack);

  // console.log(dataFilter);
  // color palette
  const color = d3.scaleOrdinal()
  .domain(["Helen", "Betty", "Dorothy", "Linda", "Deborah", "Jessica", "Patricia", "Ashley"])
  .range(['#e41a1c','#305eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf', "#9fdfdf"])

      //JOIN new data with old elements
      const lines =  svg.selectAll(".line")
      .data(dataFilter)

      //EXIT old elements not present in new data
      lines.exit().remove();

      //ENTER new elements present in new data
      lines.join("path")
        .attr("class","line")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(getRandomInt(0, 70000)) })
            (d[1])
        })
  }).catch((err) => {console.log(err)});
  
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


//const dataFilter = sumstat.filter(function(d){return d[0] == "Amanda" });

function filtercallBack(d) {
  let checkboxes = document.querySelectorAll(".checkbox");
   
   for (const checkbox of checkboxes) {
       if( d[0] === checkbox.name && checkbox.checked === true  ) {
          return true;
       } 
   }
}

function zoomed(event) {
  const xz = event.transform.rescaleX(x);
  path.attr("d", area(data, xz));
  gx.call(xAxis, xz);
}
