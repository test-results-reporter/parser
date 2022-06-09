const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_duration-ms"];
  test_case.status = rawCase["@_status"];
  if (rawCase.exception) {
    test_case.failure = rawCase.exception[0].message;
  }
  if (rawCase['@_retried'] === true) {
    test_case.status = 'RETRY';
  }
  return test_case;
}

function getTestSuiteFromTest(rawTest) {
  const suite = new TestSuite();
  suite.name = rawTest['@_name'];
  suite.duration = rawTest['@_duration-ms'];
  const rawTestMethods = [];
  const rawClasses = rawTest.class;
  for (let i = 0; i < rawClasses.length; i++) {
    rawTestMethods.push(...rawClasses[i]['test-method'].filter(raw => !raw['@_is-config']));
  }
  suite.total = rawTestMethods.length;
  suite.passed = rawTestMethods.filter(test => test['@_status'] === 'PASS').length;
  suite.failed = rawTestMethods.filter(test => test['@_status'] === 'FAIL').length;
  suite.skipped = rawTestMethods.filter(test => test['@_status'] === 'SKIP').length;
  const retried = rawTestMethods.filter(test => test['@_retried'] === true).length;
  if (retried) {
    suite.total = suite.total - retried;
    suite.skipped = suite.skipped - retried;
  }
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  for (let i = 0; i < rawTestMethods.length; i++) {
    suite.cases.push(getTestCase(rawTestMethods[i]));
  }
  return suite;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite['@_name'];
  suite.duration = rawSuite['@_duration-ms'];
  const rawTests = rawSuite.test;
  const rawTestMethods = [];
  for (let i = 0; i < rawTests.length; i++) {
    const rawTest = rawTests[i];
    const rawClasses = rawTest.class;
    for (let j = 0; j < rawClasses.length; j++) {
      rawTestMethods.push(...rawClasses[j]['test-method'].filter(raw => !raw['@_is-config']));
    }
  }
  suite.total = rawTestMethods.length;
  suite.passed = rawTestMethods.filter(test => test['@_status'] === 'PASS').length;
  suite.failed = rawTestMethods.filter(test => test['@_status'] === 'FAIL').length;
  suite.skipped = rawTestMethods.filter(test => test['@_status'] === 'SKIP').length;
  const retried = rawTestMethods.filter(test => test['@_retried'] === true).length;
  if (retried) {
    suite.total = suite.total - retried;
    suite.skipped = suite.skipped - retried;
  }
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  for (let i = 0; i < rawTestMethods.length; i++) {
    suite.cases.push(getTestCase(rawTestMethods[i]));
  }
  return suite;
}

function parse(options) {
  // TODO - loop through files
  const json = getJsonFromXMLFile(options.files[0]);
  const result = new TestResult();
  const results = json['testng-results'][0];
  result.failed = results['@_failed'];
  result.passed = results['@_passed'];
  result.total = results['@_total'];
  if (results['@_retried']) {
    result.retried = results['@_retried'];
    result.total = result.total - result.retried;
  }
  if (results['@_skipped']) {
    result.skipped = results['@_skipped'];
    // result.total = result.total - result.skipped;
  }
  const ignored = results['@_ignored'];
  if (ignored) {
    result.total = result.total - ignored;
  }

  const suites = results.suite;
  const suitesWithTests = suites.filter(suite => suite.test && suite['@_duration-ms'] > 0);

  if (suitesWithTests.length > 1) {
    for (let i = 0; i < suitesWithTests.length; i++) {
      const _suite = getTestSuite(suitesWithTests[i]);
      result.suites.push(_suite);
      result.duration += _suite.duration;
      if (!result.name) {
        result.name = _suite.name;
      }
    }
  } else if (suitesWithTests.length === 1) {
    const suite = suitesWithTests[0];
    result.name = suite['@_name'];
    result.duration = suite['@_duration-ms'];
    const rawTests = suite.test;
    const rawTestsWithClasses = rawTests.filter(_rawTest => _rawTest.class);
    for (let i = 0; i < rawTestsWithClasses.length; i++) {
      result.suites.push(getTestSuiteFromTest(rawTestsWithClasses[i]));
    }
  } else {
    console.log("No suites with tests found");
  }
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}


module.exports = {
  parse
}
