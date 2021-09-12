const parser = require('./parsers');

function parse(options) {
  return parser.parse(options);
}

module.exports = {
  parse
}