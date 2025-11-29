const fs = require('fs');
const path = require('path');
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
  // junit
  "testsuites",
  "testsuites.testsuite",
  "testsuites.testsuite.testcase",
  "testsuites.testsuite.testcase.failure",
  "testsuites.testsuite.testcase.error",
  "testsuites.testsuite.testcase.system-err",
  "testsuites.testsuite.testcase.properties.property",
  "testsuite.testcase",
  "testsuite.testcase.failure",
  "testsuite.testcase.error",
  "testsuite.testcase.system-err",
  "testsuite.testcase.properties.property",
  // xunit
  "assemblies.assembly",
  "assemblies.assembly.collection",
  "assemblies.assembly.collection.test",
  "assemblies.assembly.collection.test.failure",
  "assemblies.assembly.collection.test.traits.trait",
  // testng
  "testng-results",
  "testng-results.suite",
  "testng-results.suite.groups.group",
  "testng-results.suite.groups.group.method",
  "testng-results.suite.test",
  "testng-results.suite.test.class",
  "testng-results.suite.test.class.test-method",
  "testng-results.suite.test.class.test-method.exception",
  // mstest
  "TestRun.Results.UnitTestResult",
  "TestRun.Results.UnitTestResult.ResultFiles.ResultFile",
  "TestRun.TestDefinitions.UnitTest",
  "TestRun.TestDefinitions.UnitTest.Properties.Property",
  "TestRun.TestDefinitions.UnitTest.TestCategory.TestCategoryItem"
];

const configured_parser = new XMLParser({
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    if( FORCED_ARRAY_KEYS.indexOf(jpath) !== -1) {
      return true;
    }
    // handle nunit deep hierarchy
    else if (jpath.startsWith("test-results") || jpath.startsWith("test-run")) {
      let parts = jpath.split(".");
      switch(parts[parts.length - 1]) {
        case "category":
        case "property":
        case "test-suite":
        case "test-case":
        case "attachment":
          return true;
        default:
          return false;
      }
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
    file_path = file_path.replace(/\/|\\/g, path.sep); // convert path separators to current OS's separator
    const result = globrex(file_path);
    const dir_name = path.dirname(file_path.substring(0, file_path.indexOf('*') + 1));
    totalist(dir_name, (name) => {
      const current_file_path = path.join(dir_name, name);
      if (result.regex.test(current_file_path)) {
        file_paths.push(current_file_path);
      }
    });
    return file_paths;
  }
  return [file_path];
}

/**
 *
 * @param {string} value
 */
function decodeIfEncoded(value) {
  if (!value) {
    return value;
  }
  try {
    if (value.length % 4 !== 0) {
      return value;
    }
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(value)) {
      return value;
    }
    return atob(value);
  } catch (error) {
    return value;
  }
}

/**
 *
 * @param {string} value
 * @returns
 */
function isEncoded(value) {
  if (!value) {
    return false;
  }
  try {
    if (value.length % 4 !== 0) {
      return false;
    }
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(value)) {
      return false;
    }
    atob(value);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 *
 * @param {string} value
 */
function isFilePath(value) {
  try {
    fs.statSync(value);
    return true;
  } catch {
    return false;
  }
}

/**
  *
  * @param {string} file_name
  * @param {string} file_data
  * @param {string} file_type
  */
function saveAttachmentToDisk(file_name, file_data, file_type) {
  const folder_path = path.join(process.cwd(), '.testbeats', 'attachments');
  fs.mkdirSync(folder_path, { recursive: true });
  let data = file_data;
  if (isEncoded(file_data)) {
    data = Buffer.from(file_data, 'base64');
  } else {
    return '';
  }

  const file_path = path.join(folder_path, file_name);
  let relative_file_path = path.relative(process.cwd(), file_path);
  if (file_type.includes('png')) {
    relative_file_path = `${relative_file_path}.png`;
    fs.writeFileSync(relative_file_path, data);
  } else if (file_type.includes('jpeg')) {
    relative_file_path = `${relative_file_path}.jpeg`;
    fs.writeFileSync(relative_file_path, data);
  } else if (file_type.includes('json')) {
    relative_file_path = `${relative_file_path}.json`;
    fs.writeFileSync(relative_file_path, data);
  } else {
    return '';
  }
  return relative_file_path;
}

module.exports = {
  getJsonFromXMLFile,
  getMatchingFilePaths,
  resolveFilePath,
  decodeIfEncoded,
  isFilePath,
  saveAttachmentToDisk
}
