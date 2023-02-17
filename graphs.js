let lineChart;
let fetchData = false;


//read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
    .then(data => {


        lineChart = new LineChart("#chart-area1", data);

        d3.interval(() => {
            d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
                .then(data => {
                    lineChart.update(data, {})


                }).catch(err => console.log(err));
        }, 1000);
    }).catch(err => console.log(err));



