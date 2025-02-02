async function updateGraph() {
    let S = document.getElementById("S").value;
    let K = document.getElementById("K").value;
    let sigma = document.getElementById("sigma").value;
    let T = document.getElementById("T").value;

    try {
        let response = await fetch(`https://options-visualizer.onrender.com/option_price?S=${S}&K=${K}&T=${T}&r=0.05&sigma=${sigma}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        let optionPrice = data.option_price;

        d3.select("#graph").html(""); // Clear old graph

        let width = 500, height = 100;
        let svg = d3.select("#graph")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height / 2)
           .attr("font-size", "20px")
           .attr("text-anchor", "middle")
           .text(`Option Price: $${optionPrice.toFixed(2)}`);

        // Update 3D Graph dynamically
        updateGreeks(S, K, T, sigma);
        update3DGraph();
    } catch (error) {
        console.error("Error fetching API:", error);
        alert("Failed to fetch option price. Check backend connection.");
    }
}

async function update3DGraph() {
    let sigma = document.getElementById("sigma").value;
    let T = document.getElementById("T").value;

    let S_values = [];
    let K_values = [];
    let price_matrix = [];

    for (let s = 50; s <= 150; s += 5) {
        S_values.push(s);
    }
    for (let k = 50; k <= 150; k += 5) {
        K_values.push(k);
    }

    for (let s of S_values) {
        let row = [];
        for (let k of K_values) {
            let response = await fetch(`https://options-visualizer.onrender.com/option_price?S=${s}&K=${k}&T=${T}&r=0.05&sigma=${sigma}`);
            let data = await response.json();
            row.push(data.option_price);
        }
        price_matrix.push(row);
    }

    let trace = {
        x: K_values,
        y: S_values,
        z: price_matrix,
        type: 'surface'
    };

    let layout = {
        title: "Option Pricing Surface",
        margin: { l: 10, r: 10, t: 50, b: 50 }, // Adjust margin to prevent cutoff
        scene: {
            xaxis: { title: "Strike Price (K)" },
            yaxis: { title: "Asset Price (S)" },
            zaxis: { title: "Option Price" }
        }
    };

    let graphDiv = document.getElementById("graph3D");
    if (graphDiv) {
        graphDiv.innerHTML = ""; // Clear previous graph
        Plotly.newPlot(graphDiv, [trace], layout);
    } else {
        console.error("graph3D container not found.");
    }
}

async function updateGreeks(S, K, T, sigma) {
    try {
        let response = await fetch(`https://options-visualizer.onrender.com/option_greeks?S=${S}&K=${K}&T=${T}&r=0.05&sigma=${sigma}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        // Update the Greeks in the UI
        document.getElementById("delta").innerText = data.delta.toFixed(4);
        document.getElementById("gamma").innerText = data.gamma.toFixed(4);
        document.getElementById("vega").innerText = data.vega.toFixed(4);
        document.getElementById("theta").innerText = data.theta.toFixed(4);
        document.getElementById("rho").innerText = data.rho.toFixed(4);
    } catch (error) {
        console.error("Error fetching Greeks:", error);
    }
}

// Function to update slider value dynamically
function updateSliderValue(sliderId) {
    let slider = document.getElementById(sliderId);
    let valueDisplay = document.getElementById(sliderId + "_value");
    valueDisplay.innerText = slider.value;
}