//Build drop down list


function buildDropdown() {
  var selDataset = document.getElementById("selDataset");

  Plotly.d3.json('/names', function(error, data){
      if (error) return console.warn(error);
      for (i = 0; i < data.length; i++) {
                  SampleName=data[i]
                  var selDatasetItem = document.createElement("option");
                  selDatasetItem.text=SampleName;
                  selDatasetItem.value=SampleName;
                  selDataset.appendChild(selDatasetItem);
              }
  }
)}

buildDropdown()










//function buildMetadata(sample) {
/*
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  //Bring the Metadata flask route 
    Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
  	if (error) return console.warn(error);
    buildMetaData(metaData);
})
*/

//Click to expand inline (6 lines)
  
  // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.




    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
//}


function getPieChartData(data) {
  console.log(data.samples)
  if (data.samples.length>10) {
      endListRange=9
      }
  else endListRange=data.samples.length-1

  top10Samples=[]
  top10OTUIDs=[]
  for (i = 0; i < endListRange; i++) {
      top10Samples.push(+data.samples[i])
      top10OTUIDs.push(+data.otu_id[i])
  }

  
  pieChartData = [{
      "labels": top10OTUIDs,
      "values": top10Samples,
      "type": "pie"}]

  return pieChartData
  
}


function buildPie(sampleID) {
  url='/samples/'+sampleID;
  Plotly.d3.json(url, function(error, data){
      if (error) return console.warn(error);

      var layout = {
          title: "It's a CHART"}
      var PIE = document.getElementById('pie');

      var trace=getPieChartData(data)

      Plotly.plot(PIE, trace, layout);
  })
}

buildPie('BB_940')


function updatePieChart(newdata) {
  url='/samples/'+newdata;
  Plotly.d3.json(url, function(error, data){
      if (error) return console.warn(error);

      var PIE = document.getElementById('pie');
      
      var trace=getPieChartData(data)

      //console.log(trace)
      //console.log(trace[0].labels)
      //console.log(trace[0].values)
      Plotly.restyle(PIE, "labels", [trace[0].labels]);
      Plotly.restyle(PIE, "values", [trace[0].values]);
  })
}



function updateBubbleChart(newdata) {
  url='/samples/'+newdata;
  Plotly.d3.json(url, function(error, data){
      if (error) return console.warn(error);

      console.log("UPDATING BUBBLE CHART")
      console.log(data)
      var PLOT = document.getElementById('plot');
      
      var trace = {
          x: data.otu_id,
          y: data.samples
          };
      
      console.log(trace.x)
      var data = [trace];

      //console.log(trace)
      //console.log(trace[0].labels)
      //console.log(trace[0].values)
      Plotly.restyle(PLOT, "x", [trace.x]);
      Plotly.restyle(PLOT, "y", [trace.y]);
      Plotly.restyle(PLOT, "marker.color", [trace.x]);
  })
}




  function getMetadata(sampleID) {
      url = '/metadata/'+sampleID
      Plotly.d3.json(url, function(error, data){
          if (error) return console.warn(error);
          
          var metadata_results={
              "AGE":data.AGE[0],
              "BBTYPE":data.BBTYPE[0],
              "ETHNICITY":data.ETHNICITY[0],
              "GENDER":data.GENDER[0],
              "LOCATION":data.LOCATION[0],
              "SAMPLEID":data.SAMPLEID[0]
          }

          var Metadata=document.getElementById('metadata')
          var Age=document.getElementById('age')
          var BBType=document.getElementById('bbtype')
          var Ethnicity=document.getElementById('ethnicity')
          var Gender=document.getElementById('gender')
          var Location=document.getElementById('location')
          var SampleID=document.getElementById('sampleid')

          Age.innerHTML="Age: "+data.AGE[0]
          BBType.innerHTML="BBType: "+data.BBTYPE[0]
          Ethnicity.innerHTML="Ethnicity: "+data.ETHNICITY[0]
          Gender.innerHTML="Gender: "+data.GENDER[0]
          Location.innerHTML="Location: "+data.LOCATION[0]
          SampleID.innerHTML="Sample ID: "+data.SAMPLEID[0]


      })
      
  }



/*this is triggered when an option is selected from the dropdown*/
function optionChanged(sampleID) {

  //console.log(sampleID)

  /*print the metadata to the console*/
  //url="/metadata/"+sampleID

  //buildPie(sampleID)
  
  updatePieChart(sampleID)
  updateBubbleChart(sampleID)
  getMetadata(sampleID)

  }


function buildPlot(sampleID) {
  url = '/samples/'+sampleID
  Plotly.d3.json(url, function(error, response) {

      console.log(response.samples);
      var trace1 = {
          x: response.otu_id,
          y: response.samples,
          mode: 'markers',
          marker: {
              size: response.samples,
              colorscale: 'Rainbow',
              color: response.otu_id,
              text: "sup"
          }
      };

      var data = [trace1];
    
      var layout = {
          title: "Bubble Size", 
          height: 600,
          width: 1000
          };
      
      var PLOT = document.getElementById('plot');
      Plotly.newPlot(PLOT, data, layout);
  });
}

buildPlot('BB_940');


/*


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
*/