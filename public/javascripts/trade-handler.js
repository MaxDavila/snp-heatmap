function TradeHandler() {
  var self = this;
  if (!(this instanceof TradeHandler)) return new TradeHandler();

  self.socket = io(); 
  self.heatMap = HeatMap();
}

TradeHandler.prototype.start = function(cb) {
  var self = this;
  self.heatMap.render(cb)
  self.socket.on('trade', self.heatMap.updateCell.bind(self.heatMap));
}
