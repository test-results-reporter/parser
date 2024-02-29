const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const JUnitTypes = import('./junit.result');

function getTestCase(rawCase, suite_meta) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_time"] * 1000;
  test_case.meta_data = new Map(suite_meta);
  setMetaData(rawCase, test_case);
  if (rawCase.failure && rawCase.failure.length > 0) {
    test_case.status = 'FAIL';
    test_case.setFailure(rawCase.failure[0]["@_message"]);
  } else {
    test_case.status = 'PASS';
  }
  return test_case;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite["@_name"];
  suite.total = rawSuite["@_tests"];
  suite.failed = rawSuite["@_failures"];
  const errors = rawSuite["@_errors"];
  if (errors) {
    suite.errors = errors;
  }
  const skipped = rawSuite["@_skipped"];
  if (skipped) {
    suite.skipped = skipped;
  }
  suite.total = suite.total - suite.skipped;
  suite.passed = suite.total - suite.failed - suite.errors;
  suite.duration = rawSuite["@_time"] * 1000;
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  setMetaData(rawSuite, suite);
  const raw_test_cases = rawSuite.testcase;
  if (raw_test_cases) {
    for (let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i], suite.meta_data));
    }
  }
  return suite;
}

/**
 * 
 * @param {JUnitTypes.TestSuite | JUnitTypes.JUnitTestCase} rawElement
 * @param {TestCase | TestSuite} test_element 
 */
function setMetaData(rawElement, test_element) {
  if (rawElement.properties && rawElement.properties.property.length > 0) {
    const raw_properties = rawElement.properties.property;
    for  (const raw_property of raw_properties) {
      test_element.meta_data.set(raw_property["@_name"], raw_property["@_value"]);
    }
  }
  // handle testsuite specific attributes
  if (test_element instanceof TestSuite) {
    if (rawElement["@_hostname"]) {
      test_element.meta_data.set("hostname", rawElement["@_hostname"]);
    }
  }
}

/**
 * @param {TestResult} result 
 */
function setAggregateResults(result) {
  if (Number.isNaN(result.passed) || Number.isNaN(result.failed)) {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let errors = 0;
    let skipped = 0;
    let duration = 0;
    result.suites.forEach(_suite => {
      total = _suite.total + total;
      passed = _suite.passed + passed;
      failed = _suite.failed + failed;
      errors = _suite.errors + errors;
      skipped = _suite.skipped + skipped;
      duration = _suite.duration + duration;
    });
    result.passed = passed;
    result.failed = failed;
    result.errors = errors;
    result.skipped = skipped;
    result.total = total;
    if (Number.isNaN(result.duration)) {
      result.duration = duration;
    }
  }
}

/**
 * 
 * @param {import('./junit.result').JUnitResultJson} json 
 * @returns 
 */
function getTestResult(json) {
  const result = new TestResult();
  const rawResult = json["testsuites"] ? json["testsuites"][0] : json["testsuite"];
  result.name = rawResult["@_name"] || '';
  result.total = rawResult["@_tests"];
  result.failed = rawResult["@_failures"];
  const errors = rawResult["@_errors"];
  if (errors) {
    result.errors = errors;
  }
  const skipped = rawResult["@_skipped"];
  if (skipped) {
    result.skipped = skipped;
  }
  result.total = result.total - result.skipped;
  result.passed = result.total - result.failed - result.errors;
  result.duration = rawResult["@_time"] * 1000;
  if (json["testsuites"]) { // top-level element is testsuites
    const rawSuites = rawResult["testsuite"];
    if (!(typeof rawSuites === "undefined")) { // Don't filter if there are no testsuite objects
      const filteredSuites = rawSuites.filter(suite => suite.testcase);
      for (let i = 0; i < filteredSuites.length; i++) {
        result.suites.push(getTestSuite(filteredSuites[i]));
      }
    }
  } else { // top level element is testsuite
    result.suites.push(getTestSuite(rawResult));
  }
  
  setAggregateResults(result);
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json);
}

module.exports = {
  parse
}
