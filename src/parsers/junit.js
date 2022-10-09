const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_time"] * 1000;
  if (rawCase.failure && rawCase.failure.length > 0) {
    test_case.status = 'FAIL';
    test_case.failure = rawCase.failure[0]["@_message"];
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
  suite.passed = suite.total - suite.failed;
  suite.duration = rawSuite["@_time"] * 1000;
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  const raw_test_cases = rawSuite.testcase;
  if (raw_test_cases) {
    for(let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i]));
    }
  }
  return suite;
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
    result.suites.forEach(_suite => {
      total = _suite.total + total;
      passed = _suite.passed + passed;
      failed = _suite.failed + failed;
      errors = _suite.errors + errors;
      skipped = _suite.skipped + skipped;
    });
    result.passed = passed;
    result.failed = failed;
    result.errors = errors;
    result.skipped = skipped;
    result.total = total;
  }
}

function getTestResult(json) {
  const result = new TestResult();
  const rawResult = json["testsuites"][0];
  result.name = rawResult["@_name"];
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
  const rawSuites = rawResult["testsuite"];
  const filteredSuites = rawSuites.filter(suite => suite.testcase);
  for (let i = 0; i < filteredSuites.length; i++) {
    result.suites.push(getTestSuite(filteredSuites[i]));
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