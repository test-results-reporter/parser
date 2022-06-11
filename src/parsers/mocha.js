/*
*  Parser for both Mocha Json report and Mochawesome json
*/
const path = require('path');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["title"];
  test_case.duration = rawCase["duration"] * 1000;
  if (rawCase["state"] == "pending") {
    test_case.status = 'SKIP';
  }
  else if (rawCase.state && rawCase.state === "failed") {
    test_case.status = 'FAIL';
    test_case.failure = rawCase.err["message"];
  }
  else {
    test_case.status = 'PASS';
  }
  return test_case;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite["title"];
  suite.total = rawSuite["tests"].length;
  suite.passed = rawSuite["passes"].length;
  suite.failed = rawSuite["failures"].length;
  suite.duration = rawSuite["duration"] * 1000;
  suite.skipped = rawSuite["pending"].length;
  suite.status = suite.total === (suite.passed + suite.skipped) ? 'PASS' : 'FAIL';
  const raw_test_cases = rawSuite.tests;
  if (raw_test_cases) {
    for (let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i]));
    }
  }
  return suite;
}

function getTestResult(json) {
  const result = new TestResult();
  const { stats, results } = formatMochaJsonReport(json);
  const formattedResult = results[0] || {};
  const suites = formattedResult["suites"] || [];

  result.name = formattedResult["title"] || "";
  result.total = stats["tests"];
  result.passed = stats["passes"];
  result.failed = stats["failures"];
  const errors = formattedResult["errors"];
  if (errors) {
    result.errors = errors;
  }
  const skipped = stats["pending"];
  if (skipped) {
    result.skipped = skipped;
  }
  result.duration = (stats["duration"] || 0) * 1000;

  if (suites.length > 0) {
    for (let i = 0; i < suites.length; i++) {
      result.suites.push(getTestSuite(suites[i]));
    }
  }
  result.status = (result.total - result.skipped) === result.passed ? 'PASS' : 'FAIL';
  return result;
}

/**
 * Function to format the mocha raw json report
 * @param {*} rawjson 
 * @returns formatted json object
 */
function formatMochaJsonReport(rawjson) {
  if (rawjson.hasOwnProperty('meta')) {
    return rawjson
  }
  const formattedJson = { stats: rawjson.stats, results: [] };
  const suites = [];
  rawjson.failures.forEach(test => test.state = "failed");
  rawjson.passes.forEach(test => test.state = "passed");
  rawjson.pending.forEach( test => { 
    test.state = "pending";
    test.duration = 0;
  });

  const rawTests = [...rawjson.passes, ...rawjson.failures, ...rawjson.pending];
  const testSuites = [...new Set(rawTests.map(test => test.fullTitle.split(' ' + test.title)[0]))];

  for (const testSuite of testSuites) {
    const suite = {
      title: testSuite,
      tests: rawTests.filter(test => test.fullTitle.startsWith(testSuite))
    }
    suite.passes = suite.tests.filter(test => test.state === "passed");
    suite.failures = suite.tests.filter(test => test.state === "failed");
    suite.pending = suite.tests.filter(test => test.state === "pending");
    suite.duration = suite.tests.map(test => test.duration).reduce((total, currVal) => total + currVal, 0);
    suite.fullFile = suite.tests[0].file || "";
    suites.push(suite);
  }
  formattedJson.results.push({ suites: suites });
  return formattedJson;
}

function parse(options) {
  const cwd = process.cwd();
  const json = require(path.join(cwd, options.files[0]));
  return getTestResult(json);
} 

module.exports = {
  parse
}
