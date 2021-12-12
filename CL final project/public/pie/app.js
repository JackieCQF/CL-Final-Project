let data = [{
    "id": "community_1", "data": [56, 88, 148, 8]
}, {
    "id": "community_2", "data": [119, 88, 90, 2]
}, {
    "id": "community_3", "data": [77, 143, 78, 3]
}, {
    "id": "community_4", "data": [99, 102, 94, 5]
}, {
    "id": "community_5", "data": [44, 95, 158, 3]
}];

//Create & Append SVG
let svg = d3.select('#container')
    .append("svg")
    .attr("width", 650)
    .attr("height", 550);
let colors = d3.schemeCategory10;
let texts = ["married and have children", "married and have not had children", "unmarried and have had no children", "divorced/unmarried and have had children"];
createPieChart(data[0]);
createSelector(data);

function createPieChart(community) {
    let pieData = d3.pie()(community.data);
    console.log(pieData)
    let communityId = community.id;
    let arc = d3.arc()
        .innerRadius(80)
        .outerRadius(180);
    svg.selectAll("g").remove();
    svg.append("g")
        .attr("transform", "translate(300,300)")
        .selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("fill", (_, i) => colors[i])
        .attr("d", d => arc(d))
    svg.append("g")
        .attr("transform", "translate(300,300)")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(communityId);
    // reset the outerRadius
    arc.outerRadius(355);
    // append the texts 
    svg.append("g")
        .attr("transform", "translate(300,300)")
        .selectAll("text")
        .data(pieData)
        .enter()
        .append("text")
        .attr('transform', function (d, i) {
            let pos = arc.centroid(d);
            return 'translate(' + pos[0] + "," + pos[1] + ")";
        })
        .attr("style", "font-size:12px")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d,i)=>texts[i]+":"+d.data);  
}

function createSelector(data) {
    d3.select("#selector")
        .append("svg")
        .attr("width", 600)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(225,0)")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (_, i) => i * 30)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 20)
        .attr("fill", "#ccc")
        .attr("style", "cursor:pointer")
        .on("click", (_, d) => {
            createPieChart(d);
        })
}