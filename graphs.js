let lineChart;
let radarChart;
let fetchData = false;


//read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
    .then(data => {


        lineChart = new LineChart("#chart-area1", data);
        radarChart = new RadarChart("#chart-area2", setData())

        d3.interval(() => {
            d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
                .then(data => {
                    lineChart.update(data, {});
                    radarChart.update(setData());


                }).catch(err => console.log(err));
        }, 1000);
    }).catch(err => console.log(err));


function  setData() {
        const data = [];
        const features = ["345", "330", "315", "300", "285", "270", "255", "240", "225", "210", "195", "180", "165", "150", "135", "120", "105", "90", "75", "60", "45", "30", "15", "0"];
       
        for (var i = 0; i < 3; i++) {
            var point = {}
            //each feature will be a random number from 1-9
            features.forEach(f => point[f] = 1 + Math.random() * 8);
            data.push(point);
        }

        return data;
    }

