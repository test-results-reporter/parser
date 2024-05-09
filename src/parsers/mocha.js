/*
*  Parser for both Mocha Json report and Mochawesome json
*/
const { resolveFilePath } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["title"];
  test_case.duration = rawCase["duration"];
  setMetaData(test_case);
  if (rawCase["state"] == "pending") {
    test_case.status = 'SKIP';
  }
  else if (rawCase.state && rawCase.state === "failed") {
    test_case.status = 'FAIL';
    test_case.setFailure(rawCase.err["message"]);
  }
  else {
    test_case.status = 'PASS';
  }
  return test_case;
}

function getTestSuite(rawSuite) {
  flattenTestSuite(rawSuite);
  const suite = new TestSuite();
  suite.name = rawSuite["title"];
  suite.total = rawSuite["tests"].length;
  suite.passed = rawSuite["passes"].length;
  suite.failed = rawSuite["failures"].length;
  suite.duration = rawSuite["duration"];
  suite.skipped = rawSuite["pending"].length;
  suite.status = suite.total === (suite.passed + suite.skipped) ? 'PASS' : 'FAIL';
  setMetaData(suite);
  const raw_test_cases = rawSuite.tests;
  if (raw_test_cases) {
    for (let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i]));
    }
  }
  return suite;
}

/**
 * Function to format the mocha raw json report
 * @param {import("./mocha.result").MochaJsonData} raw_json 
 */
function getTestResult(raw_json) {
  const result = new TestResult();
  const { stats, results } = formatMochaJsonReport(raw_json);

  /** @type {import('./mocha.result').MochaResult} */
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
  result.duration = stats["duration"] || 0;

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
 * @param {import("./mocha.result").MochaJsonData} raw_json 
 * @returns formatted json object
 */
function formatMochaJsonReport(raw_json) {
  if (raw_json.hasOwnProperty('meta')) {
    return raw_json
  }
  const formattedJson = { stats: raw_json.stats, results: [] };
  const suites = [];
  raw_json.failures.forEach(test => test.state = "failed");
  raw_json.passes.forEach(test => test.state = "passed");
  raw_json.pending.forEach(test => {
    test.state = "pending";
    test.duration = 0;
  });

  const rawTests = [...raw_json.passes, ...raw_json.failures, ...raw_json.pending];
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

/**
 * 
 * @param {import("./mocha.result").MochaSuite} suite 
 */
function flattenTestSuite(suite) {
  if (!suite.suites) {
    return;
  }
  for (const child_suite of suite.suites) {
    flattenTestSuite(child_suite);
    suite.tests = suite.tests.concat(child_suite.tests);
    suite.passes = suite.passes.concat(child_suite.passes);
    suite.failures = suite.failures.concat(child_suite.failures);
    suite.pending = suite.pending.concat(child_suite.pending);
    suite.skipped = suite.skipped.concat(child_suite.skipped);
    suite.duration += child_suite.duration;
  }
}

/**
 * 
 * @param {TestCase | TestSuite} test_element 
 */
function setMetaData(test_element) {
  const regexp = /([\@\#][^\s]*)/gm; // match @tag or #tag
  const matches = [...test_element.name.matchAll(regexp)];
  if (matches.length > 0) {
    const meta_tags = [];
    const meta_raw_tags = [];
    for (const match of matches) {
      const rawTag = match[0];
      const [name, value] = rawTag.substring(1).split("=");
      if (value) {
        test_element.meta_data.set(name, value);
      } else {
        meta_tags.push(name);
        meta_raw_tags.push(rawTag);
      }
    }
    test_element.meta_data.set("tags", meta_tags.join(","));
    test_element.meta_data.set("tagsRaw", meta_raw_tags.join(","));
  }
}


function parse(file) {
  const json = require(resolveFilePath(file));
  return getTestResult(json);
}

module.exports = {
  parse
}
