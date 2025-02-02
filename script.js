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

        let width = 500, height = 400;
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
        update3DGraph();
    } catch (error) {
        console.error("Error fetching API:", error);
        alert("Failed to fetch option price. Check backend connection.");
    }
}

async function update3DGraph() {
    let S = document.getElementById("S").value;
    let K = document.getElementById("K").value;
    let sigma = document.getElementById("sigma").value;
    let T = document.getElementById("T").value;

    let S_values = [];
    let K_values = [];
    let price_matrix = [];

    for (let s = 50; s <= 150; s += 5) {
        S_values.push(s);
        let row = [];
        for (let k = 50; k <= 150; k += 5) {
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
        scene: {
            xaxis: { title: "Strike Price (K)" },
            yaxis: { title: "Asset Price (S)" },
            zaxis: { title: "Option Price" }
        }
    };

    Plotly.newPlot('graph3D', [trace], layout);
}
