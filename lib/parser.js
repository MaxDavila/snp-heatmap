var snpCompanies = require('../data/snp500.json')
var fs = require('fs')

var result = {
  name: "snp500",
  children: []
}

var symbols = {
  symbols: collectSymbols(snpCompanies)
}

snpCompanies.forEach(function(company){
  var sectors = result.children;

  for (var i = 0; i < sectors.length; i++) {
    if (sectors[i].name == company.Sector) {
      sectors[i].children.push(addCompany(company));
      return
    }
  }
  sectors.push(generateSector(company))
});

fs.writeFile("../data/newtest.json", JSON.stringify(result, null, 2), function(err) {
    if(err) {
      console.log(err);
    } 
    else {
      console.log("JSON stock data was saved!");
    }
}); 

fs.writeFile("../data/symbols.json", JSON.stringify(symbols, null, 2) , function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Symbols were saved!")
  }
})

function addCompany(company) {
  return {
    name: company.Name,
    symbol: company.Symbol,
    size: company['Market Cap'],
    last: company.Price,
    colour: "#f9f0ab"
  }
}

function generateSector(company) {
  return {
    name: company.Sector,
    children: [ addCompany(company) ]
  }
}

function collectSymbols(companies) {
  return companies.map(function(company) {
    return company.Symbol;
  })
}
