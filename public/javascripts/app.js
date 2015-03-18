var io = io();
$(document).ready(function() {

  io.on('trade', function(data) {
    console.log(data)
    var tickerRect = d3.select("#" + data.trade.symbol);
    var tickerCurrentPrice = parseFloat(tickerRect.attr('data-price'));
    var tickertLastPrice = parseFloat(data.trade.last);
    var change = (tickertLastPrice - tickerCurrentPrice) * 100.00 / tickertLastPrice
    var color = getColor(change)
    tickerRect.transition().duration(1000).style("fill", color)
    tickerRect.attr('data-price', tickertLastPrice)
  });


  function getColor(change) {
    if (change <= -3.0) {
      return "#F63538"
    }
    else if (change <= -2.0) {
      return "#BF4045"
    }
    else if (change <= -1.0) {
      return "#8B444E"
    }
    else if (change <= 0.0) {
      return "#7D3D46"
    }  
    else if (change >= 3.0) {
      return "#30CC5A"
    }
    else if (change >= 2.0) {
      return "#2F9E4F"
    }
    else if (change >= 1.0) {
      return "#35764E"
    }
    else {
      return "#2F6A46"
    }
  }




  var w = 1280 - 80,
      h = 800 - 180,
      x = d3.scale.linear().range([0, w]),
      y = d3.scale.linear().range([0, h]),
      color = d3.scale.category20c(),
      root,
      node;

  var treemap = d3.layout.treemap()
      .round(false)
      .size([w, h])
      .sticky(true)
      .value(function(d) { return d.size; });

  var svg = d3.select("#body").append("div")
      .attr("class", "chart")
      .style("width", w + "px")
      .style("height", h + "px")
    .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(.5,.5)");

  d3.json("/new-snp-data.json", function(data) {
    node = root = data;
    var nodes = treemap.nodes(root)
        .filter(function(d) { return !d.children; });

    var cell = svg.selectAll("g")
        .data(nodes)
      .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

    cell.append("svg:rect")
        .attr("width", function(d) { return d.dx - 1; })
        .attr("height", function(d) { return d.dy - 1; })
        .attr("id", function(d) { return d.symbol; })
        .attr("data-price", function(d) { return d.last; })
        .style("fill", function(d) { return d.colour; });

    cell.append("svg:text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.symbol; })
        .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

    d3.select(window).on("click", function() { zoom(root); });

    d3.select("select").on("change", function() {
      treemap.value(this.value == "size" ? size : count).nodes(root);
      zoom(node);
    });
  });

  function size(d) {
    return d.size;
  }

  function count(d) {
    return 1;
  }

  function zoom(d) {
    var kx = w / d.dx, ky = h / d.dy;
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    var t = svg.selectAll("g.cell").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    t.select("rect")
        .attr("width", function(d) { return kx * d.dx - 1; })
        .attr("height", function(d) { return ky * d.dy - 1; })

    t.select("text")
        .attr("x", function(d) { return kx * d.dx / 2; })
        .attr("y", function(d) { return ky * d.dy / 2; })
        .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
  }

});
