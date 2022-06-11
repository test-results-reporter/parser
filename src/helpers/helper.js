const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');

function getJsonFromXMLFile(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  return parser.parse(xml, { arrayMode: true, ignoreAttributes: false, parseAttributeValue: true });
}

module.exports = {
  getJsonFromXMLFile
}