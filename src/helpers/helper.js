const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');
const { totalist } = require('totalist/sync');
const globrex = require('globrex');
const { XMLParser } = require("fast-xml-parser");


/**
 * fast xml parser v4's default behavior is to return an object if there is only one element
 * in the array. This is not desirable for our use case. We sometimes want to force an array
 * these are the keys to which that is required.
 * @type {string[]}
 */
const FORCED_ARRAY_KEYS = [
  "testsuites",
  "testsuites.testsuite",
  "testsuites.testsuite.testcase",
  "testsuites.testsuite.testcase.failure",
  "assemblies",
  "assemblies.assembly",
  "assemblies.assembly.collection",
  "assemblies.assembly.collection.test",
  "assemblies.assembly.collection.test.failure",
  "testng-results",
  "testng-results.suite",
  "testng-results.suite.test",
  "testng-results.suite.test.class",
  "testng-results.suite.test.class.test-method",
  "testng-results.suite.test.class.test-method.exception",
];

const configured_parser = new XMLParser({
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    if( FORCED_ARRAY_KEYS.indexOf(jpath) !== -1) {
      return true;
    }
  },
  ignoreAttributes: false,
  parseAttributeValue: true,
});

function resolveFilePath(filePath) {
  const cwd = process.cwd();
  return path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
}

function getJsonFromXMLFile(filePath) {
  const xml = fs.readFileSync(resolveFilePath(filePath)).toString();
  return configured_parser.parse(xml);
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
  getMatchingFilePaths,
  resolveFilePath
}
