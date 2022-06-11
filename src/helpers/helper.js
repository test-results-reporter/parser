const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');

function getJsonFromXMLFile(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  return parser.parse(xml, { arrayMode: true, ignoreAttributes: false, parseAttributeValue: true });
}

function getJsonFromFile(filePath) {
  const cwd = process.cwd();
  const jsonFile = fs.readFileSync(path.join(cwd, filePath));
  return JSON.parse(jsonFile);
}

module.exports = {
  getJsonFromXMLFile,
  getJsonFromFile
}