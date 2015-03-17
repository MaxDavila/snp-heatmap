var snpCompanies = require('../data/snp500.json');
var Snp500 = require('./snp500');
var fs = require('fs');

var snpUtil = {
  updateCompanies: function() {
    var snp500 = new Snp500(snpCompanies)
    this.writeTofile("./data/new-snp-data.json", snp500);
  },
  writeTofile: function(filepath, content) {
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log("Writing to " + filepath + " succeeded");
  }
}

module.exports = snpUtil

