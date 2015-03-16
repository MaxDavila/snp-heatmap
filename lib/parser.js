var snpCompanies = require('../data/snp5000.json');
var snpCompanyData = require('../data/snp500.json');
var allSectors = require('../data/sectors.json');
var fs = require('fs');

function Company(company) {
  this.name = company.name;
  this.symbol = company.symbol;
  this.sharesOutstanding = company.sho;
  this.size = calculateMarkCap(company);
  this.last = parseFloat(company.last);
  this.previousClose = parseFloat(company.cl)
  if (this.last < this.previousClose) {
    this.colour = "red"
  }
  else {
    this.colour = "green"
  }
}

function Sector(company) {
  this.name = allSectors[company.symbol];
  this.children = [ new Company(company) ]
}
function Snp500(data) {
  this.name = "snp500";
  this.children = [];
  this.loadCompanies(data);
}

Snp500.prototype.loadCompanies = function(companies) {
  var self = this;
   companies.forEach(function(company) {
    var sectors = self.children;

    for (var i = 0; i < sectors.length; i++) {
      if (sectors[i].name == allSectors[company.symbol]) {
        sectors[i].children.push(new Company(company));
        return
      }
    }
    sectors.push(new Sector(company));
  });
}

var parser = {
  updateCompanies: function() {
    var snp500 = new Snp500(snpCompanies)
    this.writeTofile("./data/newtest.json", snp500);
  },
  writeTofile: function(filepath, content) {
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log("Writing to " + filepath + " succeeded");
  }
}

module.exports = parser

function calculateMarkCap(company) {
  return parseFloat(company.last.replace(/,/g,'')) * parseFloat(company.sho.replace(/,/g,''));
}
