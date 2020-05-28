const data = JSON.parse(document.getElementById('graphdata').innerText);

const ems_graph_area = d3.select('#graph_area').append('svg');

ems_graph_area.class('test_svg', true);

let plotdata = data.map((entry, index) => {
  return {
    yval: entry.ems_days / (entry.ems_count > 0 ? entry.ems_count : 1),
    xval: index,
  }
}).filter(entry => entry.yval > 0);

ems_graph_area
  .append('path')
  .datum(plotdata)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 3)
  .attr('d', d3.line()
    .x(d => d.xval * 10)
    .y(d => 300 - d.yval)
  );
