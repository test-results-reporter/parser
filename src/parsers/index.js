const testng = require('./testng');
const junit = require('./junit');
const xunit = require('./xunit');
const mocha = require('./mocha');
const cucumber = require('./cucumber');

function parse(options) {
  switch (options.type) {
    case 'testng':
      return testng.parse(options);
    case 'junit':
      return junit.parse(options);
    case 'xunit':
      return xunit.parse(options);
    case 'mocha':
        return mocha.parse(options);
    case 'cucumber':
          return cucumber.parse(options);
    default:
      throw `UnSupported Result Type - ${options.type}`;
  }
}

module.exports = {
  parse
}