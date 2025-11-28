const { getJsonFromXMLFile } = require('../helpers/helper');
const { getDate } = require('./base.helpers');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const TestAttachment = require('../models/TestAttachment');

const SUITE_TYPES_WITH_TEST_CASES = [
  "TestFixture",
  "ParameterizedTest",
  "GenericFixture",
  "ParameterizedMethod"   // v3
]

const RESULT_MAP = {
  Success: "PASS",        // v2
  Failure: "FAIL",        // v2
  Ignored: "SKIP",        // v2
  NotRunnable: "SKIP",    // v2
  Error: "ERROR",         // v2
  Inconclusive: "FAIL",   // v2

  Passed: "PASS",         // v3
  Failed: "FAIL",         // v3
  Skipped: "SKIP",        // v3
}

function populateAttachments(rawCase, attachments) {
  if (rawCase.attachments && rawCase.attachments.attachment) {
    let rawAttachments = rawCase.attachments.attachment;
    for (var i = 0; i < rawAttachments.length; i++) {
      var attachment = new TestAttachment();
      attachment.path = rawAttachments[i].filePath;
      if (rawAttachments[i].description) {
        attachment.name = rawAttachments[i].description;
      }
      attachments.push(attachment);
    }
  }
}

function mergeMeta(map1, map2) {
  for (let kvp of Object.entries(map1)) {
    map2[kvp[0]] = kvp[1];
  }
}

/**
 *
 * @param {*} raw
 * @param {TestCase | TestSuite} test_element
 */
function populateMetaData(raw, test_element) {

  // v2 supports categories
  if (raw.categories) {
    let categories = raw.categories.category;
    for (let i = 0; i < categories.length; i++) {
      let categoryName = categories[i]["@_name"];
      test_element.tags.push(categoryName);

      // create comma-delimited list of categories
      if (test_element.metadata["Categories"]) {
        test_element.metadata["Categories"] = test_element.metadata["Categories"].concat(",", categoryName);
      } else {
        test_element.metadata["Categories"] = categoryName;
      }
    }
  }

  // v2/v3 support properties
  if (raw.properties) {
    let properties = raw.properties.property;
    for (let i = 0; i < properties.length; i++) {
      let property = properties[i];
      let propName = property["@_name"];
      let propValue = property["@_value"];

      // v3 treats 'Categories' as property "Category"
      if (propName == "Category") {

        if (test_element.metadata["Categories"]) {
          test_element.metadata["Categories"] = test_element.metadata["Categories"].concat(",", propValue);
        } else {
          test_element.metadata["Categories"] = propValue;
        }

      } else {
        test_element.metadata[propName] = propValue;
      }
    }
  }
}

function getNestedTestCases(rawSuite) {
  if (rawSuite.results) {
    return rawSuite.results["test-case"];
  } else {
    return rawSuite["test-case"];
  }
}

function hasNestedSuite(rawSuite) {
  return getNestedSuite(rawSuite) !== null;
}

function getNestedSuite(rawSuite) {
  // nunit v2 nests test-suite inside 'results'
  if (rawSuite.results && rawSuite.results["test-suite"]) {
    return rawSuite.results["test-suite"];
  } else {
    // nunit v3 nests test-suites as immediate children
    if (rawSuite["test-suite"]) {
      return rawSuite["test-suite"];
    }
    else {
      // not nested
      return null;
    }
  }
}

function getTestCases(rawSuite, parent_meta) {
  const cases = [];

  let rawTestCases = getNestedTestCases(rawSuite);
  if (rawTestCases) {
    for (let i = 0; i < rawTestCases.length; i++) {
      let rawCase = rawTestCases[i];
      let testCase = new TestCase();
      let result = rawCase["@_result"]
      testCase.id = rawCase["@_id"] ?? "";
      testCase.name = rawCase["@_fullname"] ?? rawCase["@_name"];
      testCase.duration = (rawCase["@_time"] ?? rawCase["@_duration"]) * 1000; // in milliseconds
      testCase.startTime = getDate(rawCase["@_start-time"]);
      testCase.endTime = getDate(rawCase["@_end-time"]);
      testCase.status = RESULT_MAP[result];

      // v2 : non-executed should be tests should be Ignored
      if (rawCase["@_executed"] == "False") {
        testCase.status = "SKIP"; // exclude failures that weren't executed.
      }
      // v3 : failed tests with error label should be Error
      if (rawCase["@_label"] == "Error") {
        testCase.status = "ERROR";
      }
      if (rawCase["@_label"] == "Invalid") {
        testCase.status = "SKIP"; // treat invalid tests as skipped
      }
      let errorDetails = rawCase.reason ?? rawCase.failure;
      if (errorDetails !== undefined) {
        testCase.setFailure(errorDetails.message);
        if (errorDetails["stack-trace"]) {
          testCase.stack_trace = errorDetails["stack-trace"]
        }
      }
      // populate attachments
      populateAttachments(rawCase, testCase.attachments);
      // copy parent_meta data to test case
      mergeMeta(parent_meta, testCase.metadata);
      populateMetaData(rawCase, testCase);

      cases.push(testCase);
    }
  }

  return cases;
}

function getTestSuites(rawSuites, assembly_meta) {
  const suites = [];

  for (let i = 0; i < rawSuites.length; i++) {
    let rawSuite = rawSuites[i];

    if (rawSuite["@_type"] == "Assembly") {
      assembly_meta = {};
      populateMetaData(rawSuite, { tags: [], metadata: assembly_meta });
    }

    if (hasNestedSuite(rawSuite)) {
      // handle nested test-suites
      suites.push(...getTestSuites(getNestedSuite(rawSuite), assembly_meta));
    } else if (SUITE_TYPES_WITH_TEST_CASES.indexOf(rawSuite["@_type"]) !== -1) {

      let suite = new TestSuite();
      suite.id = rawSuite["@_id"] ?? '';
      suite.name = rawSuite["@_fullname"] ?? rawSuite["@_name"];
      suite.duration = (rawSuite["@_time"] ?? rawSuite["@_duration"]) * 1000; // in milliseconds
      suite.startTime = getDate(rawSuite["@_start-time"]);
      suite.endTime = getDate(rawSuite["@_end-time"]);
      suite.status = RESULT_MAP[rawSuite["@_result"]];
      if (rawSuite["@_label"] == "Invalid") {
        suite.status = "SKIP"; // treat invalid suites as skipped
      }

      mergeMeta(assembly_meta, suite.metadata);
      populateMetaData(rawSuite, suite);
      suite.cases.push(...getTestCases(rawSuite, suite.metadata));

      // calculate totals
      suite.total = suite.cases.length;
      suite.passed = suite.cases.filter(i => i.status == "PASS").length;
      suite.failed = suite.cases.filter(i => i.status == "FAIL").length;
      suite.errors = suite.cases.filter(i => i.status == "ERROR").length;
      suite.skipped = suite.cases.filter(i => i.status == "SKIP").length;

      suites.push(suite);
    }
  }

  return suites;
}

function getTestResult(json) {
  const nunitVersion = (json["test-results"] !== undefined) ? "v2" :
    (json["test-run"] !== undefined) ? "v3" : null;

  if (nunitVersion == null) {
    throw new Error("Unrecognized xml format");
  }

  const result = new TestResult();
  const rawResult = json["test-results"] ?? json["test-run"];
  const rawSuite = (rawResult["test-suite"] !== undefined) ? rawResult["test-suite"][0] : { "@_time": 0, "@_result": "Passed"};

  result.name = rawResult["@_fullname"] ?? rawResult["@_name"];
  result.duration = (rawSuite["@_time"] ?? rawSuite["@_duration"]) * 1000; // in milliseconds
  result.status = RESULT_MAP[rawSuite["@_result"]];

  result.suites.push(...getTestSuites([rawSuite], null));

  result.total = result.suites.reduce((total, suite) => { return total + suite.cases.length }, 0);
  result.passed = result.suites.reduce((total, suite) => { return total + suite.passed }, 0);
  result.failed = result.suites.reduce((total, suite) => { return total + suite.failed }, 0);
  result.skipped = result.suites.reduce((total, suite) => { return total + suite.skipped }, 0);
  result.errors = result.suites.reduce((total, suite) => { return total + suite.errors }, 0);

  // nunit v2 has date + time and duration from test cases  
  if (nunitVersion == "v2") {
    let date = rawResult["@_date"];
    let time = rawResult["@_time"];
    if (date && time) {
      let startTime = getDate(`${date}T${time}Z`); // always assume UTC
      result.startTime = startTime;
      result.endTime = new Date(startTime.getTime() + result.duration);
    }
  }
  // nunit v3 includes start and end times at the test run level
  if (nunitVersion == "v3") {
    result.startTime = getDate(rawResult["@_start-time"]);
    result.endTime = getDate(rawResult["@_end-time"]);
  }

  return result;
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json);
}

module.exports = {
  parse
}