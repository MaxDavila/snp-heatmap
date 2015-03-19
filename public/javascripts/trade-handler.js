function TradeHandler() {
  var self = this;
  if (!(this instanceof TradeHandler)) return new TradeHandler();

  self.socket = io(); 
  self.heatMap = HeatMap();
}

TradeHandler.prototype.start = function() {
  var self = this;
  self.heatMap.render()
  self.socket.on('trade', self.heatMap.updateCell.bind(self.heatMap));
}
