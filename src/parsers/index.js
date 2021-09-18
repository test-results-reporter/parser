const testng = require('./testng');
const junit = require('./junit');

function parse(options) {
  switch (options.type) {
    case 'testng':
      return testng.parse(options);
    case 'junit':
      return junit.parse(options);
    default:
      throw `UnSupported Result Type - ${options.type}`;
  }
}

module.exports = {
  parse
}