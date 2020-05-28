const data = JSON.parse(document.getElementById('graphdata').innerText);

// Draw area values
const margin = {
  top: 10,
  right: 10,
  bottom: 50,
  left: 50,
};
const width = 510;
const height = 300;

// Create draw area
const ems_graph_area = d3.select('#graph_area')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 
          `translate(${margin.left},${margin.top})`)

// Prepare data
let plotdata = data.map((entry, index) => {
  return {
    yval: entry.ems_days / (entry.ems_count > 0 ? entry.ems_count : 1),
    xval: index,
  }
}).filter(entry => entry.yval > 0);

// X label
const x = d3.scaleLinear()
  .domain([0, 51])
  .range([width, 0]);
ems_graph_area.append('g')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x));

// Y label
const y = d3.scaleLinear()
  .domain([0, d3.max(plotdata, d => d.yval)])
  .range([height, 0]);
ems_graph_area.append('g')
  .call(d3.axisLeft(y));

// Line
ems_graph_area
  .append('path')
  .datum(plotdata)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 3)
  .attr('d', d3.line()
    .x(d => x(d.xval))
    .y(d => y(d.yval))
  );
