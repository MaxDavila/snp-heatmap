function HeatMap() {
  var self = this;
  if (!(this instanceof HeatMap)) return new HeatMap();

  self.dataUrl = "/new-snp-data.json"
  self.colors = { red: "#BF4045", green: "#2F9E4F" }
  self.w = 1280 - 80;
  self.h = 800 - 180;
  self.root;
  self.node;

  self.treemap = d3.layout.treemap()
    .round(false)
    .size([self.w, self.h])
    .sticky(true)
    .value(function(d) { return d.size; });

  self.svg = d3.select("#body")
    .append("div")
      .attr("class", "chart")
      .style("width", self.w + "px")
      .style("height", self.h + "px")
    .append("svg:svg")
      .attr("width", self.w)
      .attr("height", self.h)
    .append("svg:g")
      .attr("transform", "translate(.5,.5)");
}

HeatMap.prototype.render = function(cb) {
  var self = this;

  d3.json(self.dataUrl, function(data) {
    self.node = self.root = data;
    var nodes = self.treemap.nodes(self.root).filter(function(d) { return !d.children; });
    
    self.renderCells(nodes, cb);
  });
}

HeatMap.prototype.renderCells = function(nodes, done) {
  var self = this;
  var cell = self.svg.selectAll("g").data(nodes)
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("data-toggle", "popover")
      .attr("data-trigger", "hover")
      .attr("data-content", function(d) { return d.last; })
      .attr("data-original-title", function(d) { return d.symbol })

  // append rect
  cell.append("svg:rect")
    .attr("width", function(d) { return d.dx - 1; })
    .attr("height", function(d) { return d.dy - 1; })
    .attr("id", function(d) { return d.symbol; })
    .attr("data-price", function(d) { return d.last; })
    .style("fill", function(d) { return d.colour; });

  // append text
  cell.append("svg:text")
    .attr("x", function(d) { return d.dx / 2; })
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.symbol; })
    .style("opacity", function(d) {
      d.w = this.getComputedTextLength();
      return ((d.dx - 1) > d.w && (d.dy -1) > d.w)  ? 1 : 0;
    });
  done()
}

HeatMap.prototype.updateCell = function(data) {
  var tickerRect = d3.select("#" + data.trade.symbol);
  var tickerCurrentPrice = parseFloat(tickerRect.attr('data-price'));
  var tickertLastPrice = parseFloat(data.trade.last);
  var change = tickertLastPrice - tickerCurrentPrice
  var color = change <= 0 ? this.colors.red : this.colors.green

  tickerRect.transition().duration(1000).style("fill", color)
  tickerRect.attr('data-price', tickertLastPrice)
}
