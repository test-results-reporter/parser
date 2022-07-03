const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const { totalist } = require('totalist/sync');
const globrex = require('globrex');

function getJsonFromXMLFile(filePath) {
  const cwd = process.cwd();
  const xml = fs.readFileSync(path.join(cwd, filePath)).toString();
  return parser.parse(xml, { arrayMode: true, ignoreAttributes: false, parseAttributeValue: true });
}

/**
 * @param {string} file_path 
 */
function getMatchingFilePaths(file_path) {
  if (file_path.includes('*')) {
    const file_paths = [];
    const result = globrex(file_path);
    const dir_name = path.dirname(file_path.substring(0, file_path.indexOf('*') + 1));
    totalist(dir_name, (name) => {
      const current_file_path = `${dir_name}/${name}`;
      if (result.regex.test(current_file_path)) {
        file_paths.push(current_file_path);
      }
    });
    return file_paths;
  }
  return [file_path];
}

module.exports = {
  getJsonFromXMLFile,
  getMatchingFilePaths
}