const parser = require('./parsers');

function parse(options) {
  return parser.parse(options);
}

function parseV2(options) {
  return parser.parseV2(options);
}

module.exports = {
  parse,
  parseV2
}