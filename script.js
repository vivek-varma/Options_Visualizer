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
            let response = await fetch(`https://your-app-name.onrender.com/option_price?S=${s}&K=${k}&T=${T}&r=0.05&sigma=${sigma}`);
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

    Plotly.newPlot('graph', [trace], layout);
}
