var allSectors = require('../data/sectors.json');

function Company(company) {
  this.name = company.name;
  this.symbol = company.symbol;
  this.sharesOutstanding = parseFloat(company.sho);
  this.size = calculateMarkCap(company);
  this.last = parseFloat(company.last);
  this.prevClose = parseFloat(company.pcls);
  this.prevCloseChange = this.prevClose < this.last ? parseFloat(company.pchg) : -parseFloat(company.pchg);
  this.colour = getColor(this.prevCloseChange);
}

function Sector(company) {
  this.name = allSectors[company.symbol];
  this.children = [ new Company(company) ]
}

function Snp500(data) {
  this.name = "snp500";
  this.children = [];
  this._loadCompanies(data);
}

Snp500.prototype._loadCompanies = function(companies) {
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

module.exports = Snp500

function calculateMarkCap(company) {
  return parseFloat(company.last.replace(/,/g,'')) * parseFloat(company.sho.replace(/,/g,''));
}

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
    return "#414554"
  }
}
