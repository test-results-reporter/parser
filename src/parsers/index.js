const testng = require('./testng');

function parse(options) {
  switch (options.type) {
    case 'testng':
      return testng.parse(options)
    default:
      throw `UnKnown Result Type - ${options.type}`
  }
}

module.exports = {
  parse
}