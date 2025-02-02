async function updateGraph() {
    let S = document.getElementById("S").value;
    let K = document.getElementById("K").value;
    let sigma = document.getElementById("sigma").value;
    let T = document.getElementById("T").value;
    
    let response = await fetch(`/option_price?S=${S}&K=${K}&T=${T}&r=0.05&sigma=${sigma}`);
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
}
