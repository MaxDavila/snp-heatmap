$(document).ready(function() {
  TradeHandler().start(function() {
    $('[data-toggle="popover"]').popover({
      container: ".chart",
      placement: "auto right"
    });
  });
});
