/*
*  Parser for both Mocha Json report and Mochawesome json
*/
const path = require('path');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["name"];
  test_case.duration = rawCase["duration"];
  if (rawCase.state && rawCase.state === "failed") {
    test_case.status = 'FAIL';
    test_case.failure = rawCase.errorStack;
  }
  else {
    test_case.status = 'PASS';
  }
  return test_case;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite["name"];
  suite.total = rawSuite["tests"];
  suite.passed = rawSuite["passes"];
  suite.failed = rawSuite["failures"];
  suite.duration = rawSuite["duration"];
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  const raw_test_cases = rawSuite.elements;
  if (raw_test_cases) {
    for (let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i]));
    }
  }
  return suite;
}

function getTestResult(json) {
  const result = new TestResult();
  const { stats, suites } = preprocess(json);
  result.name = suites["name"] || "";
  result.total = stats["tests"];
  result.passed = stats["passes"];
  result.failed = stats["failures"];
  const errors = stats["errors"];
  if (errors) {
    result.errors = errors;
  }
  result.duration = stats["duration"] || 0;

  if (suites.length > 0) {
    for (let i = 0; i < suites.length; i++) {
      result.suites.push(getTestSuite(suites[i]));
    }
  }
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}

/**
 * Function to format the raw json report
 * @param {*} rawjson 
 * @returns formatted json object
 */
function preprocess(rawjson) {
  const formattedResult = { stats: {}, suites: [] };

  rawjson.forEach(testSuite => {
    testSuite.elements.forEach(testCase => {
      testCase.state = testCase.steps.every(step => step.result.status === "passed") ? "passed" : "failed";
      testCase.duration = testCase.steps.map(step => step.result.duration).reduce((total, currVal) => total + currVal, 0) / 1000000;
      testCase.duration = parseFloat(testCase.duration.toFixed(2));
      testCase.errorStack = testCase.steps.filter(step => step.result.status === "failed").map(step => step.result.error_message)[0] || "";
    })
    testSuite.tests = testSuite.elements.length;

    if (testSuite.tests) {
      testSuite.failures = testSuite.elements.filter(testCase => testCase.state === "failed").length;
      testSuite.passes = testSuite.elements.filter(testCase => testCase.state === "passed").length;
      testSuite.duration = testSuite.elements.map(testCase => testCase.duration).reduce((total, currVal) => total + currVal, 0);
    }
    formattedResult.suites.push(testSuite);
  });

  formattedResult.stats.suites = formattedResult.suites.length;
  for (const statsType of ["tests", "passes", "failures", "errors", "duration"]) {
    formattedResult.stats[statsType] = formattedResult.suites.map(testSuite => testSuite[statsType]).reduce((total, currVal) => total + currVal, 0) || 0;    
  }
  return formattedResult;
}

function parse(file) {
  const cwd = process.cwd();
  const json = require(path.join(cwd, file));
  return getTestResult(json);
} 

module.exports = {
  parse
}
