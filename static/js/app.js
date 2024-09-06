// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

     // Get the metadata field
     let metadata = data.metadata;

     // Filter the metadata for the object with the desired sample number
     let selectedMetadata = metadata.find(obj => obj.id == sample); // Assuming id is the key for the sample number
 
     // Use d3 to select the panel with id of `#sample-metadata`
     let metadataPanel = d3.select("#sample-metadata");
 
     // Clear any existing metadata
     metadataPanel.html("");
 
     // Loop through each key-value pair in the filtered metadata and append new tags
     Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
   });
  }
 

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selectedSamples = samples.filter(obj => obj.id === sample)[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = selectedSamples.otu_ids;
    let otuLabels = selectedSamples.otu_labels;
    let sampleValues = selectedSamples.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }];

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData);

    // Map the otu_ids to a list of strings for your yticks
    let yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // Build a Bar Chart
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Render the Bar Chart
    Plotly.newPlot('bar', barData);
    });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option")
        .text(sample)
        .attr("value", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
