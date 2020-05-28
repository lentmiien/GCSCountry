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
  .data(plotdata)
  .enter()
  .append(rect)
  .attr('x', d => d.xval * 10)
  .attr('y', d => 300 - d.yval)
  .attr('width', 9)
  .attr('height', d => d.yval)
  .attr('fill', 'green')