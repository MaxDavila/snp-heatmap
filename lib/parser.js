var symbols = require('../data/snp500.json')
var fs = require('fs')

var result = {
  name: "snp500",
  children: []
}

symbols.forEach(function(symbol){
  var sectors = result.children;

  for (var i = 0; i < sectors.length; i++) {
    if (sectors[i].name == symbol.Sector) {
      sectors[i].children.push(addSymbol(symbol));
      return
    }
  }
  sectors.push(generateSector(symbol))
});

fs.writeFile("../data/newtest.json", JSON.stringify(result, null, 2), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 

console.log(JSON.stringify(result))

function addSymbol(symbol) {
  return {
    name: symbol.Name,
    symbol: symbol.Symbol,
    size: symbol['Market Cap'],
    last: symbol.Price,
    colour: "#f9f0ab"
  }
}

function generateSector(symbol) {
  return {
    name: symbol.Sector,
    children: [ addSymbol(symbol) ]
  }
}
